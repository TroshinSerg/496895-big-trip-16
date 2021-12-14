import {isEscKeyCode} from './utils/common.js';
import {render, replace, RenderPosition} from './utils/render.js';
import MenuView from './view/menu-view.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import EventsListView from './view/events-list-view.js';
import NoEventsView from './view/no-events-view.js';
import PointView from './view/point-view.js';
import EditPointView from './view/edit-point-view.js';
import AddPointView from './view/add-point-view.js';
import TripInfoView from './view/trip-info-view.js';
import {generatePoint, DESTINATION_COUNT} from './mock/point.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const eventsListComponent = new EventsListView();
const filtersComponent = new FiltersView();

const POINTS_COUNT = 3;

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = index % DESTINATION_COUNT;
  return generatePoint(index + 1, destinationId);
});

const createTripInfoData = (items = []) => {
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

const renderPoint = (listComponent, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);


  const replaceToPoint = () => {
    //eventsListComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
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
    //eventsListComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    replace(editPointComponent, pointComponent);

    document.addEventListener('keydown', onEscapeKeyDown);

    editPointComponent.element.addEventListener('click', () => {
      replaceToPoint();
      document.addEventListener('keydown', onEscapeKeyDown);
    });
  };

  pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceToEditPoint();
  });

  editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceToPoint();
  });

  render(listComponent, pointComponent, RenderPosition.BEFOREEND);
};

//const renderList = (isDataAvailable) => {};

render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(filtersElement, filtersComponent, RenderPosition.BEFOREEND);

if (points.length) {
  render(tripMainElement, new TripInfoView(createTripInfoData(points)), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, new SortView(), RenderPosition.BEFOREEND);
  render(tripEventsElement, eventsListComponent, RenderPosition.BEFOREEND);

  points.forEach((point) => {
    renderPoint(eventsListComponent, point);
  });

  render(eventsListComponent, new AddPointView(), RenderPosition.BEFOREEND);
} else {
  const NoEventsComponentMap = {};

  filtersComponent.element.elements['trip-filter'].forEach((filter) => {
    NoEventsComponentMap[filter.value.toUpperCase()] = new NoEventsView(filter.value);
  });

  // Значение переменной activeFilterValue изменится при событии change у элемента компонента фильтров
  let activeFilterValue = filtersComponent.element.querySelector('input:checked').value.toUpperCase();
  render(tripEventsElement, NoEventsComponentMap[activeFilterValue].element, RenderPosition.BEFOREEND);

  filtersComponent.element.addEventListener('change', (evt) => {
    const filterInput = evt.target.closest('.trip-filters__filter-input');

    if (filterInput) {
      evt.preventDefault();
      const newActiveFilterValue = filterInput.value.toUpperCase();

      tripEventsElement.replaceChild(NoEventsComponentMap[newActiveFilterValue].element, NoEventsComponentMap[activeFilterValue].element);

      // Обновляем значение переменной activeFilterValue на значение активного фильтра
      activeFilterValue = newActiveFilterValue;
    }
  });
}
