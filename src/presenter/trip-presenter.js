import {SortPointsMethodMap, FilterPointsMethodMap} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import EventsListView from '../view/events-list-view';
import SortView from '../view/sort-view';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';

//import AddPointView from '../view/add-point-view.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #sortComponent = null;
  #pointsModel = null;
  #filterModel = null;
  #eventsListComponent = null;
  #noEventsComponent = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.EVERYTHING;

  constructor(tripEventsContainer, pointsModel, filterModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = FilterPointsMethodMap[this.#currentFilterType.toUpperCase()](points);

    if (this.#currentSortType === SortType.DEFAULT) {
      return filteredPoints;
    }

    return ( SortPointsMethodMap[this.#currentSortType.toUpperCase()](filteredPoints) );
  }

  init = () => {
    const points = this.points;
    (points.length ? this.#renderEventsBoard : this.#renderNoEvents)(points);
  };

  #onModeChange = () => {
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
    const pointPresenter = new PointPresenter(this.#eventsListComponent, this.#onViewAction, this.#onModeChange);
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
    render(this.#tripEventsContainer, this.#noEventsComponent, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setOnFormChange(this.#onSortTypeChange);
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  };

  #renderEventsList = () => {
    this.#eventsListComponent = new EventsListView();
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);
  };

  #clearEventsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderEventsBoard = (points) => {
    if (points.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
    this.#renderPoints(points);

    //render(this.#tripEventsContainer, new AddPointView(), RenderPosition.BEFOREEND);
  };

  #clearEventsBoard = ({resetSortType = false} = {}) => {
    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    this.#clearEventsList();

    remove(this.#sortComponent);
    remove(this.#eventsListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
