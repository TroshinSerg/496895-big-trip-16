import {generatePoint, DESTINATION_COUNT} from './mock/point.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, navigationElement, filtersElement);

const POINTS_COUNT = 15;

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = index % DESTINATION_COUNT;
  return generatePoint(index + 1, destinationId);
});

tripPresenter.init(points);
