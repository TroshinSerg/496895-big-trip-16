import {renderTemplate, RenderPosition} from './render.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createFiltersTemplate} from './view/filters-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createEventsListTemplate} from './view/events-list-view.js';
import {createPointTemplate} from './view/point-view.js';
import {createEditPointTemplate} from './view/edit-point-view.js';
import {createAddPointTemplate} from './view/add-point-view.js';
import {generatePoint, DESTINATION_COUNT} from './mock/point.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const EVENT_POINT_COUNT = 3;
const POINTS_COUNT = 15;
const points = [];

const DestinationIdMap = (() => {
  const part = Math.floor(POINTS_COUNT / DESTINATION_COUNT);
  const map = {};

  for (let i = 1; i <= DESTINATION_COUNT; i++) {
    map[part * i] = i - 1;
  }

  return map;
})();

const destinationIdMapKeys = Object.keys(DestinationIdMap);

for (let i = 1; i <= POINTS_COUNT; i++) {
  const destinationId = DestinationIdMap[destinationIdMapKeys.find((it) => parseInt(it, 10) >= i)];
  points.push(generatePoint(i, destinationId));
}

renderTemplate(navigationElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filtersElement, createFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(tripEventsElement, createEventsListTemplate(), RenderPosition.BEFOREEND);

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');
tripEventsListElement.innerHTML = '';

for (let i = 0; i < EVENT_POINT_COUNT; i++) {
  renderTemplate(tripEventsListElement, createPointTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(tripEventsListElement, createEditPointTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(tripEventsListElement, createAddPointTemplate(), RenderPosition.BEFOREEND);
