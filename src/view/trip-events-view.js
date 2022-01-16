import AbstractView from './abstract-view.js';

const createTripEventsTemplate = () => (
  '<section class="trip-events"><h2 class="visually-hidden">Trip events</h2></section>'
);

export default class TripEventsView extends AbstractView {
  get template() {
    return createTripEventsTemplate();
  }
}
