import {renderElement, RenderPosition} from './render.js';
import MenuView from './view/menu-view.js';
import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import EventsListView from './view/events-list-view.js';
import PointView from './view/point-view.js';
import EditPointView from './view/edit-point-view.js';
import AddPointView from './view/add-point-view.js';
import TripInfoView from './view/trip-info-view.js';
import {generatePoint, DESTINATION_COUNT} from './mock/point.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const eventsListElement = new EventsListView().element;

const POINTS_COUNT = 15;

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = index % DESTINATION_COUNT;
  return generatePoint(index + 1, destinationId);
});

const createTripInfoData = (items) => {
  // Если назвать параметр points линтер ругается: points is already declared in the upper scope on line 20 column 7 no-shadow
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
const fragment = document.createDocumentFragment();

points.forEach((point, index) => {
  fragment.append(index ? new PointView(point).element : new EditPointView(point).element);
});

renderElement(tripMainElement, new TripInfoView(createTripInfoData(points)).element, RenderPosition.AFTERBEGIN);
renderElement(navigationElement, new MenuView().element, RenderPosition.BEFOREEND);
renderElement(filtersElement, new FiltersView().element, RenderPosition.BEFOREEND);
renderElement(tripEventsElement, new SortView().element, RenderPosition.BEFOREEND);
renderElement(tripEventsElement, eventsListElement, RenderPosition.BEFOREEND);
renderElement(eventsListElement, fragment, RenderPosition.BEFOREEND);
renderElement(eventsListElement, new AddPointView().element, RenderPosition.BEFOREEND);
