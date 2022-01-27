import AbstractView from './abstract-view.js';

const TripEventsMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now',
};

const createNoEventsTemplate = (filterName) => (
  `<p class="trip-events__msg">${TripEventsMessage[filterName.toUpperCase()]}</p>`
);

export default class NoEventsView extends AbstractView {
  #filterName = null;

  constructor(filterName) {
    super();
    this.#filterName = filterName;
  }

  get template() {
    return createNoEventsTemplate(this.#filterName);
  }
}
