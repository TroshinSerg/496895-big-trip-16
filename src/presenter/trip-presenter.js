import {SortPointsMethodMap, FilterPointsMethodMap} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import TripEventsView from '../view/trip-events-view';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';
import NoEventsView from '../view/no-events-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';

export default class TripPresenter {
  #pageMainContainer = null;
  #sortComponent = null;
  #pointsModel = null;
  #filterModel = null;
  #tripEventsComponent = new TripEventsView();
  #eventsListComponent = new EventsListView();
  #noEventsComponent = null;
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(pageMainContainer, pointsModel, filterModel) {
    this.#pageMainContainer = pageMainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#eventsListComponent, this.#onViewAction, this.#onNewPointDeleteClick);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;

    const points = [...this.#pointsModel.points];
    const filteredPoints = FilterPointsMethodMap[this.#currentFilterType.toUpperCase()](points);

    if (this.#currentSortType === SortType.DEFAULT) {
      return filteredPoints;
    }

    return ( SortPointsMethodMap[this.#currentSortType.toUpperCase()](filteredPoints) );
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {
    this.#pointsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);

    this.#renderEventsBoard(this.points);
  };

  destroy = () => {
    this.#clearEventsBoard({resetSortType: true});

    this.#pointsModel.removeObserver(this.#onModelEvent);
    this.#filterModel.removeObserver(this.#onModelEvent);
  };

  createPoint = (button) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    this.#renderEventsList();
    this.#newPointPresenter.init(button, this.offers, this.destinations);
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventsBoard();
        this.#renderEventsBoard(this.points);
        break;
      case UpdateType.MAJOR:
        this.#clearEventsBoard({resetSortType: true});
        this.#renderEventsBoard(this.points);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventsBoard(this.points);
        break;
    }
  };

  #onNewPointDeleteClick = () => {
    if (this.points.length === 0) {
      this.#clearEventsBoard();
      this.#renderEventsBoard(this.points);
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderPoints(this.points);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#eventsListComponent, this.#onViewAction, this.#onModeChange, this.offers, this.destinations);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoEvents = () => {
    this.#noEventsComponent = new NoEventsView(this.#currentFilterType);
    render(this.#tripEventsComponent, this.#noEventsComponent, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setOnFormChange(this.#onSortTypeChange);
    render(this.#tripEventsComponent, this.#sortComponent, RenderPosition.BEFOREEND);
  };

  #renderTripEvents = () => {
    render(this.#pageMainContainer, this.#tripEventsComponent, RenderPosition.BEFOREEND);
  };

  #renderLoading = () => {
    render(this.#tripEventsComponent, this.#loadingComponent, RenderPosition.BEFOREEND);
  };

  #renderEventsList = () => {
    render(this.#tripEventsComponent, this.#eventsListComponent, RenderPosition.BEFOREEND);
  };

  #clearEventsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderEventsBoard = (points) => {
    this.#renderTripEvents();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (points.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
    this.#renderPoints(points);
  };

  #clearEventsBoard = ({resetSortType = false} = {}) => {
    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    this.#newPointPresenter.destroy();
    this.#clearEventsList();

    remove(this.#loadingComponent);
    remove(this.#sortComponent);
    remove(this.#eventsListComponent);
    remove(this.#tripEventsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
