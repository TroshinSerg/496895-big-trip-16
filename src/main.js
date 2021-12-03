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
const points = [];

for (let i = 1; i <= POINTS_COUNT; i++) {
  const destinationId = getRandomInteger(0, DESTINATION_COUNT - 1);

  points.push(generatePoint(i, destinationId));
}

const createTripInfoData = (arr) => {
  let route = new Set();
  let totalPrice = 0;
  let startDate = new Date(arr[0].dateFrom).getTime();
  let endDate = 0;

  arr.forEach((it) => {
    totalPrice += it.basePrice;

    if (it.offers.offers.length) {
      totalPrice += it.offers.offers.filter((offer) => offer.isChecked).reduce((a, b) => a + b.price, 0);
    }

    route.add(it.destination.name);

    if (new Date(it.dateFrom).getTime() < startDate) {
      startDate = new Date(it.dateFrom).getTime();
    }

    if (new Date(it.dateTo).getTime() > endDate) {
      endDate = new Date(it.dateTo).getTime();
    }
  });

  route = [...route].join(' — ');
  startDate = new Date(startDate);
  endDate = new Date(endDate);

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
