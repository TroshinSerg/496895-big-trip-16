import {isEscKeyCode} from '../utils/common.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import EventsListView from '../view/events-list-view';
import MenuView from '../view/menu-view';
import FiltersView from '../view/filters-view';
import SortView from '../view/sort-view';
import TripInfoView from '../view/trip-info-view';
import NoEventsView from '../view/no-events-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
//import AddPointView from '../view/add-point-view.js';

export default class TripPresenter {
  #tripMainContainer = null;
  #tripEventsContainer = null;
  #menuContainer = null;
  #filtersContainer = null;

  #tripInfoComponent = null;

  #eventsListComponent = new EventsListView();
  #menuComponent = new MenuView();
  #filtersComponent = new FiltersView();
  #sortComponent = new SortView();

  #points = [];

  constructor(tripMainContainer, tripEventsContainer, menuContainer, filtersContainer) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
  }

  init = (points) => {
    this.#points = [...points];
    this.#tripInfoComponent = new TripInfoView(this.#createTripInfoData(this.#points));

    this.#renderControls();
    (this.#points.length ? this.#renderEventsBoard : this.#renderNoEventsMessage)();
  };

  #renderPoint = (listComponent, point) => {
    const pointComponent = new PointView(point);
    const editPointComponent = new EditPointView(point);

    const replaceToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const onEscapeKeyDown = (evt) => {
      if (isEscKeyCode(evt.keyCode)) {
        evt.preventDefault();
        replaceToPoint();
        document.removeEventListener('keydown', onEscapeKeyDown);
      }
    };

    const replaceToEditPoint = () => {
      replace(editPointComponent, pointComponent);
    };

    pointComponent.setEditClickHandler(() => {
      replaceToEditPoint();
      document.addEventListener('keydown', onEscapeKeyDown);
    });

    editPointComponent.setformSubmitHandler(() => {
      replaceToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    editPointComponent.setEditClickHandler(() => {
      replaceToPoint();
      document.removeEventListener('keydown', onEscapeKeyDown);
    });

    render(listComponent, pointComponent, RenderPosition.BEFOREEND);
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

    this.#filtersComponent.setFormChangeHandler((evt) => {
      changeNoEventsMessage(evt);
    });
  };

  #renderEventsBoard = () => {
    render(this.#tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this.#tripEventsContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    render(this.#tripEventsContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);

    this.#points.forEach((point) => {
      this.#renderPoint(this.#eventsListComponent, point);
    });

    //render(eventsListComponent, new AddPointView(), RenderPosition.BEFOREEND);
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
