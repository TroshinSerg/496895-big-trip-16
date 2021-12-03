import {getRandomInteger} from './utils.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createFiltersTemplate} from './view/filters-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createEventsListTemplate} from './view/events-list-view.js';
import {createPointTemplate} from './view/point-view.js';
import {createEditPointTemplate} from './view/edit-point-view.js';
import {createAddPointTemplate} from './view/add-point-view.js';
import {createTripInfoTemplate} from './view/trip-info-view.js';
import {generatePoint, DESTINATION_COUNT} from './mock/point.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const POINTS_COUNT = 15;

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = getRandomInteger(0, DESTINATION_COUNT - 1);
  return generatePoint(index + 1, destinationId);
});

const createTripInfoData = (pointsArray) => {
  // Если назвать параметр points линтер ругается: points is already declared in the upper scope on line 20 column 7 no-shadow
  const destinationsNames = new Set();
  let totalPrice = 0;
  let startDateInSeconds = new Date(pointsArray[0].dateFrom).getTime();
  let endDateInSeconds = 0;

  pointsArray.forEach((point) => {
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

renderTemplate(tripMainElement, createTripInfoTemplate(createTripInfoData(points)), RenderPosition.AFTERBEGIN);

renderTemplate(navigationElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filtersElement, createFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createEventsListTemplate(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');
tripEventsListElement.innerHTML = '';

points.forEach((point, index) => {
  if (index === 0) {
    renderTemplate(tripEventsListElement, createEditPointTemplate(point), RenderPosition.AFTERBEGIN);
  } else {
    renderTemplate(tripEventsListElement, createPointTemplate(point), RenderPosition.BEFOREEND);
  }
});

renderTemplate(tripEventsListElement, createAddPointTemplate(), RenderPosition.BEFOREEND);
