import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import {generateDestination, DESTINATIONS_NAMES} from '../mock/destination.js';
import {generateOffer} from '../mock/offer.js';
import {Color, ErrorMessage, DEBOUNCE_DELAY} from '../utils/const.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { debounce } from '../utils/common.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DateType= {
  DATEFROM: 'maxDate',
  DATETO: 'minDate'
};

const ReverseDateType = {
  DATEFROM: 'dateTo',
  DATETO: 'dateFrom'
};

const domItems = [
  {
    name: 'FORM',
    selector: 'form'
  },
  {
    name: 'DESTINATION',
    selector: '.event__input--destination'
  },
  {
    name: 'DATES',
    selector: '.event__input--time',
    isList: true
  },
  {
    name: 'PRICE',
    selector: '.event__input--price'
  },
  {
    name: 'SAVE',
    selector: '.event__save-btn'
  },
  {
    name: 'DELETE',
    selector: '.event__reset-btn'
  },
  {
    name: 'ROLLUP',
    selector: '.event__rollup-btn'
  }
];

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: generateDestination(0),
  id: null,
  isFavorite: false,
  additionalOffer: generateOffer(TYPES[0]),
  type: TYPES[0]
};

const createEditPointTemplate = (point, isNewPoint) => {
  const {basePrice, dateFrom, dateTo, destination, id, additionalOffer, type} = point;

  let offersMarkup = '';
  let imagesMarkup = '';
  let destinationMarkup = '';

  const eventTypeItemsMarkup = TYPES.map((eventType) => (
    `<div class="event__type-item">
      <input id="event-type-${eventType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType[0].toUpperCase() + eventType.slice(1)}</label>
    </div>`
  )).join('');

  const destinationOptionsMarkup = DESTINATIONS_NAMES.map((name) => (
    `<option value="${name}"></option>`
  )).join('');

  if (additionalOffer.offers.length) {
    offersMarkup = additionalOffer.offers.map((offer) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" data-id="${offer.id}" id="event-offer-${offer.mod}-${id}" type="checkbox" name="event-offer-${offer.mod}"${offer.isChecked ? ' checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.mod}-${id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    )).join('');

    offersMarkup = `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`;
  }

  if (destination.description) {
    if (destination.pictures.length) {
      imagesMarkup = destination.pictures.map((picture) => (
        `<img class="event__photo" src="${picture.src}" alt="Event photo">`
      )).join('');

      imagesMarkup = `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${imagesMarkup}
        </div>
      </div>`;
    }

    destinationMarkup = `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      ${imagesMarkup}
    </section>`;
  }

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${eventTypeItemsMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${destinationOptionsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" data-type="dateFrom" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" data-type="dateTo" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      <section class="event__details">
        ${offersMarkup}
        ${destinationMarkup}
      </section>
    </form>
  </li>`;
};

export default class EditPointView extends SmartView {
  #datepicker = new Map();
  #dateInput = new Map();
  #DOM = new Map();
  #isNewPoint = false;
  #ExtremeDate = {
    MAXDATE: null,
    MINDATE: null
  };

  #datepickerOptions = null;

  constructor(point = EMPTY_POINT) {
    super();

    this._state = EditPointView.parseDataToState(point);

    this.#isNewPoint = point === EMPTY_POINT;
    this.#ExtremeDate.MAXDATE = point.dateTo;
    this.#ExtremeDate.MINDATE = point.dateFrom;

    this.#datepickerOptions = {
      dateFormat: 'd/m/y H:i',
      defaultDate: dayjs().toDate(),
      enableTime: true,
      onChange: this.#onDateChange
    };

    this.#executeFunctions();
    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#isNewPoint);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker.size) {
      this.#datepicker.forEach((datepicker) => datepicker.destroy());
      this.#datepicker.clear();
    }

    this.#dateInput.clear();
    this.#DOM.clear();
  };

  reset = (point) => {
    this.updateState(EditPointView.parseDataToState(point));
  };

  restore = () => {
    this.#executeFunctions();
    this.#restoreHandlers();
  };

  #executeFunctions = () => {
    this.#setDom();
    this.#setDatepicker();
    this.#formValidation();
  };

  #restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setOnFormSubmit(this._callback.formSubmit);
    this.setOnEditClick(this._callback.editClick);
    this.setOnDeleteClick(this._callback.deleteClick);
  }

  setOnFormSubmit = (callback) => {
    this._callback.formSubmit = callback;
    this.#DOM.get('FORM').addEventListener('submit', this.#onFormSubmit);
  };

  setOnEditClick = (callback) => {
    if (this.#DOM.get('ROLLUP') === null) {
      return;
    }

    this._callback.editClick = callback;
    this.#DOM.get('ROLLUP').addEventListener('click', this.#onEditClick);
  };

  setOnDeleteClick = (callback) => {
    this._callback.deleteClick = callback;
    this.#DOM.get('DELETE').addEventListener('click', this.#onDeleteClick);
  };

  #setDatepicker = () => {
    this.#DOM.get('DATES').forEach((input) => {
      const key = input.dataset.type;
      const keyUpper = key.toUpperCase();
      const date = this.#ExtremeDate[DateType[keyUpper].toUpperCase()];
      const datepicker = flatpickr(input, {...this.#datepickerOptions, defaultDate: this._state[key], [DateType[keyUpper]]: date});

      this.#datepicker.set(keyUpper, datepicker);
      this.#dateInput.set(keyUpper, input);
    });
  };

  #setInnerHandlers = () => {
    this.#DOM.get('FORM').addEventListener('change', this.#onFormChange);
    this.#DOM.get('PRICE').addEventListener('input', this.#onPriceInput);
    this.#DOM.get('DESTINATION').addEventListener('input', this.#onDestinationInput);
  };

  #onDateChange = ([userDate], formatedDate, instance) => {
    this.updateState({
      [instance.element.dataset.type]: userDate,
    }, true);

    const key = instance.element.dataset.type;
    const reverseKey = ReverseDateType[key.toUpperCase()];
    const reverseKeyUpper = reverseKey.toUpperCase();
    const extremeDateKey = DateType[reverseKeyUpper].toUpperCase();
    this.#ExtremeDate[extremeDateKey] = userDate;

    this.#datepicker.get(reverseKeyUpper).destroy();
    this.#datepicker.delete(reverseKeyUpper);

    const datepicker = flatpickr(this.#dateInput.get(reverseKeyUpper), {...this.#datepickerOptions, defaultDate: this._state[reverseKey], [DateType[reverseKeyUpper]] : this.#ExtremeDate[extremeDateKey]});
    this.#datepicker.set(reverseKeyUpper, datepicker);
  };

  #onFormChange = (evt) => {
    const eventTypeInput = evt.target.closest('input[name="event-type"]');
    const eventOfferCheckbox = evt.target.closest('.event__offer-checkbox');

    if (eventTypeInput) {
      const newEventType = eventTypeInput.value;

      this.updateState({
        type: newEventType,
        additionalOffer: generateOffer(newEventType)
      });
    }

    if (eventOfferCheckbox) {
      const eventOfferCheckboxId = parseInt(eventOfferCheckbox.dataset.id, 10);
      const newOffers = this._state.additionalOffer.offers.map((offersItem) => ({...offersItem}));

      const offer = newOffers.find((offersItem) => offersItem.id === eventOfferCheckboxId);
      offer.isChecked = !(offer.isChecked);

      this.updateState({
        additionalOffer: {...this._state.additionalOffer, offers: newOffers}
      }, true);
    }
  };

  #onPriceInput = (evt) => {
    evt.target.value = evt.target.value.replace(/\D/g, '');

    this.#formValidation();

    this.updateState({
      basePrice: parseInt(evt.target.value, 10)
    }, true);
  };

  #onDestinationInput = (evt) => {
    this.#formValidation({destinationCallback: () => {
      if (this._state.destination.name !== evt.target.value) {
        this.updateState({
          destination: {...generateDestination(0), name: evt.target.value}
        });
      }
    }});
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToData(this._state));
  };

  #onEditClick = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #onDeleteClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parseStateToData(this._state));
  };

  #isDestinationValid = () => {
    const value = this.#DOM.get('DESTINATION').value;
    return value !== '' && DESTINATIONS_NAMES.includes(value);
  };

  #isPriceValid = () => {
    const value = this.#DOM.get('PRICE').value;
    return value !== '' && parseInt(value, 10) > 0;
  };

  #setValidityState = (element, message, isValid) => {
    const parent = element.parentElement;

    element.style.color = isValid ? '' : Color.INVALID;
    parent.style.borderBottomColor = isValid ? '' : Color.INVALID;

    element.setCustomValidity(isValid ? '' : message);
  };

  #formValidation = debounce((callback = {destinationCallback: null}) => {
    const isDestinationValid = this.#isDestinationValid();
    const isPriceValid = this.#isPriceValid();

    this.#setValidityState(this.#DOM.get('DESTINATION'), ErrorMessage.DESTINATION, isDestinationValid);
    this.#setValidityState(this.#DOM.get('PRICE'), ErrorMessage.PRICE, isPriceValid);

    if (isDestinationValid && callback.destinationCallback) {
      callback.destinationCallback();
    }

    this.#DOM.get('SAVE').disabled = !(isDestinationValid && isPriceValid);
  }, DEBOUNCE_DELAY, false);


  #setDom = () => {
    domItems.forEach((domItem) => {
      this.#DOM.set(domItem.name, this.element[domItem.isList ? 'querySelectorAll' : 'querySelector'](domItem.selector));
    });
  };

  static parseDataToState = (data) => ({...data});

  static parseStateToData = (state) => {
    const data = {...state};

    return data;
  };
}
