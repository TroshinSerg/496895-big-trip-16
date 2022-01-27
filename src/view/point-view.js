import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import {getDurationString, getDurationInMinutes} from '../utils/common.js';

const createPointTemplate = (point) => {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = point;
  let offersMarkup = '';

  const durationInMinutes = getDurationInMinutes(dateFrom, dateTo);
  const durationString = getDurationString(durationInMinutes);

  if (offers.length) {
    offersMarkup = offers.map((offer) => (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    ));

    offersMarkup = `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>`;
  }

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(dateFrom).format('YYYY-MM-DD')}">${dayjs(dateFrom).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type[0].toUpperCase() + type.slice(1)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateFrom).format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDTHH:mm')}">${dayjs(dateTo).format('HH:mm')}</time>
        </p>
        <p class="event__duration">${durationString}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${offersMarkup}
      <button class="event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  setOnEditClick = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditClick);
  };

  setOnIsFavoriteClick = (callback) => {
    this._callback.isFavoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onIsFavoriteClick);
  };

  #onEditClick = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #onIsFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.isFavoriteClick();
  };
}
