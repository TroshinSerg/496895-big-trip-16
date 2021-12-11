import {createElement} from '../render';

const TripEventsMessageMap = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  FUTURE: 'There are no future events now'
};

const createNoEventsTemplate = (filterName) => (
  `<p class="trip-events__msg">${TripEventsMessageMap[filterName.toUpperCase()]}</p>`
);

export default class NoEventsView {
  #element = null;
  #filterName = null;

  constructor(filterName) {
    this.#filterName = filterName;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoEventsTemplate(this.#filterName);
  }

  removeElement() {
    this.#element = null;
  }
}
