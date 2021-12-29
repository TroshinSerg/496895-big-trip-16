import {SortPointsMethodMap} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import EventsListView from '../view/events-list-view';
import MenuView from '../view/menu-view';
import FiltersView from '../view/filters-view';
import SortView from '../view/sort-view';
import TripInfoView from '../view/trip-info-view';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction} from '../utils/const.js';

//import AddPointView from '../view/add-point-view.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #tripEventsContainer = null;
  #menuContainer = null;
  #filtersContainer = null;
  #sortComponent = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #eventsListComponent = null;

  #menuComponent = new MenuView();
  #filtersComponent = new FiltersView();

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripMainContainer, tripEventsContainer, menuContainer, filtersContainer, pointsModel) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#onModelEvent);
  }

  get points() {
    if (this.#currentSortType === SortType.DEFAULT) {
      return this.#pointsModel.points;
    }

    return ( SortPointsMethodMap[this.#currentSortType.toUpperCase()]([...this.#pointsModel.points]) );
  }

  init = () => {
    const points = this.points;
    this.#renderControls();
    (points.length ? this.#renderEventsBoard : this.#renderNoEventsMessage)(points);
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

  #renderNoEventsMessage = () => {
    const NoEventsComponentMap = {};

    this.#filtersComponent.element.elements['trip-filter'].forEach((filter) => {
      NoEventsComponentMap[filter.value.toUpperCase()] = new NoEventsView(filter.value);
    });

    // Значение переменной activeFilterValue изменится при событии change у элемента компонента фильтров
    let activeFilterValue = this.#filtersComponent.element.querySelector('input:checked').value.toUpperCase();
    render(this.#tripEventsContainer, NoEventsComponentMap[activeFilterValue], RenderPosition.BEFOREEND);

    const changeNoEventsMessage = (evt) => {
      const filterInput = evt.target.closest('.trip-filters__filter-input');

      if (filterInput) {
        evt.preventDefault();
        const newActiveFilterValue = filterInput.value.toUpperCase();

        replace(NoEventsComponentMap[newActiveFilterValue], NoEventsComponentMap[activeFilterValue]);

        // Обновляем значение переменной activeFilterValue на значение активного фильтра
        activeFilterValue = newActiveFilterValue;
      }
    };

    this.#filtersComponent.setOnFormChange((evt) => {
      changeNoEventsMessage(evt);
    });
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setOnFormChange(this.#onSortTypeChange);
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  };

  #renderTripInfo = (points) => {
    this.#tripInfoComponent = new TripInfoView(this.#createTripInfoData(points));
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
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
    this.#renderTripInfo(points);
    this.#renderSort();
    this.#renderEventsList();
    this.#renderPoints(points);

    //render(this.#tripEventsContainer, new AddPointView(), RenderPosition.BEFOREEND);
  };

  #clearEventsBoard = ({resetSortType = false} = {}) => {
    this.#clearEventsList();

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#eventsListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderControls = () => {
    render(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
    render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  };

  #createTripInfoData = (items = []) => {
    const destinationsNames = new Set();
    let totalPrice = 0;
    let startDateInSeconds = new Date(items[0].dateFrom).getTime();
    let endDateInSeconds = 0;

    items.forEach((point) => {
      totalPrice += point.basePrice;

      if (point.additionalOffer.offers.length) {
        totalPrice += point.additionalOffer.offers
          .filter((offer) => offer.isChecked)
          .reduce((totalOfferPrice, offer) => totalOfferPrice + offer.price, 0);
      }

      destinationsNames.add(point.destination.name);

      // Если дата начала последующих точек маршрута ранее, чем дата старта маршрута - перезаписываем стартовую дату
      startDateInSeconds = Math.min(startDateInSeconds, new Date(point.dateFrom).getTime());

      // Если дата окончания последующих точек маршрута позже, чем дата окончания маршрута - перезаписываем дату окончания маршрута
      endDateInSeconds = Math.max(endDateInSeconds, new Date(point.dateTo).getTime());
    });

    const route = [...destinationsNames].join(' — ');
    const startDate = new Date(startDateInSeconds);
    const endDate = new Date(endDateInSeconds);

    return {
      route,
      totalPrice,
      startDate,
      endDate
    };
  };
}
