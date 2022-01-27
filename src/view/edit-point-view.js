import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import {Color, ErrorMessage, DEBOUNCE_DELAY, EVENT_TYPES} from '../utils/const.js';
import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { debounce, getRandomId } from '../utils/common.js';

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: {},
  id: null,
  isFavorite: false,
  offers: [],
  type: EVENT_TYPES[0]
};

const DateType= {
  FROM: 'maxDate',
  TO: 'minDate'
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

const createEditPointTemplate = (point, destinations, isNewPoint) => {
  const {basePrice, dateFrom, dateTo, destination, id, offers, type, isDisabled, isSaving, isDeleting} = point;

  const price = String(basePrice);

  let offersMarkup = '';
  let imagesMarkup = '';
  let destinationMarkup = '';

  const eventTypeItemsMarkup = EVENT_TYPES.map((eventType) => (
    `<div class="event__type-item">
      <input id="event-type-${eventType}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${eventType}"${isDisabled ? ' disabled' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType[0].toUpperCase() + eventType.slice(1)}</label>
    </div>`
  )).join('');

  const destinationOptionsMarkup = destinations.map((destinationItem) => (
    `<option value="${he.encode(destinationItem.name)}"></option>`
  )).join('');

  if (offers.length) {
    offersMarkup = offers.map((offer) => {
      const idPart = getRandomId(type);

      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" data-id="${offer.id}" id="event-offer-${idPart}-${id}" type="checkbox" name="event-offer-${type}"${offer.isChecked ? ' checked' : ''}${isDisabled ? ' disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${idPart}-${id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }).join('');

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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox"${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}"${isDisabled ? ' disabled' : ''}>
          <datalist id="destination-list-${id}">
            ${destinationOptionsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" data-type="dateFrom" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}"${isDisabled ? ' disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" data-type="dateTo" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}"${isDisabled ? ' disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${he.encode(price)}"${isDisabled ? ' disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? ' disabled' : ''}>${isSaving ? ' Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset"${isDisabled ? ' disabled' : ''}>${isDeleting ? ' Deleting...' : 'Delete'}</button>
        ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button"${isDisabled ? ' disabled' : ''}>
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
  #dom = new Map();
  #isNewPoint = false;
  #point = null;
  #allOffers = null;
  #destinations = null;
  #destinationsNames = null;
  #extremeDate = {
    max: null,
    min: null
  };

  #datepickerOptions = null;

  constructor(point, allOffers, destinations) {
    super();

    this.#allOffers = allOffers;
    this.#destinations = destinations;
    this.#destinationsNames = destinations.map((destination) => destination.name);

    this.#isNewPoint = point === null;
    this.#point = this.#isNewPoint ? {...EMPTY_POINT, destination: this.#destinations[0]} : point;

    this._state = this.#parseDataToState(this.#point);

    this.#extremeDate.max = this.#point.dateTo;
    this.#extremeDate.min = this.#point.dateFrom;

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
    return createEditPointTemplate(this._state, this.#destinations, this.#isNewPoint);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker.size) {
      this.#datepicker.forEach((datepicker) => datepicker.destroy());
      this.#datepicker.clear();
    }

    this.#dateInput.clear();
    this.#dom.clear();
  };

  reset = (point) => {
    this.updateState(this.#parseDataToState(point));
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
    this.#dom.get('FORM').addEventListener('submit', this.#onFormSubmit);
  };

  setOnEditClick = (callback) => {
    if (this.#dom.get('ROLLUP') === null) {
      return;
    }

    this._callback.editClick = callback;
    this.#dom.get('ROLLUP').addEventListener('click', this.#onEditClick);
  };

  setOnDeleteClick = (callback) => {
    this._callback.deleteClick = callback;
    this.#dom.get('DELETE').addEventListener('click', this.#onDeleteClick);
  };

  #setDatepicker = () => {
    this.#dom.get('DATES').forEach((input) => {
      const key = input.dataset.type;
      const typeKey = key.split('date')[1].toUpperCase();
      const extremeDataKey = DateType[typeKey].split('Date')[0];
      const date = this.#extremeDate[extremeDataKey];
      const datepicker = flatpickr(input, {...this.#datepickerOptions, defaultDate: this._state[key], [DateType[typeKey]]: date});

      this.#datepicker.set(typeKey, datepicker);
      this.#dateInput.set(typeKey, input);
    });
  };

  #setInnerHandlers = () => {
    this.#dom.get('FORM').addEventListener('change', this.#onFormChange);
    this.#dom.get('PRICE').addEventListener('input', this.#onPriceInput);
    this.#dom.get('DESTINATION').addEventListener('input', this.#onDestinationInput);
  };

  #onDateChange = ([userDate], formatedDate, instance) => {
    this.updateState({
      [instance.element.dataset.type]: userDate,
    }, true);

    const key = instance.element.dataset.type;
    const reverseKey = ReverseDateType[key.toUpperCase()];
    const typeKey = reverseKey.split('date')[1].toUpperCase();
    const extremeDateKey = DateType[typeKey].split('Date')[0];

    this.#extremeDate[extremeDateKey] = userDate;

    this.#datepicker.get(typeKey).destroy();
    this.#datepicker.delete(typeKey);

    const datepicker = flatpickr(this.#dateInput.get(typeKey), {...this.#datepickerOptions, defaultDate: this._state[reverseKey], [DateType[typeKey]]: this.#extremeDate[extremeDateKey]});

    this.#datepicker.set(typeKey, datepicker);
  };

  #onFormChange = (evt) => {
    const eventTypeInput = evt.target.closest('input[name="event-type"]');
    const eventOfferCheckbox = evt.target.closest('.event__offer-checkbox');

    if (eventTypeInput) {
      const type = eventTypeInput.value;
      this.updateState({type, offers: this.#getOffersForType(type)});
    }

    if (eventOfferCheckbox) {
      const eventOfferCheckboxId = parseInt(eventOfferCheckbox.dataset.id, 10);

      const offers = this._state.offers.map((offer) => ({...offer}));
      const changedOffer = offers.find((offer) => offer.id === eventOfferCheckboxId);

      changedOffer.isChecked = !changedOffer.isChecked;

      this.updateState({offers}, true);
    }
  };

  #onPriceInput = (evt) => {
    this.#formValidation();

    this.updateState({basePrice: parseInt(evt.target.value, 10)}, true);
  };

  #onDestinationInput = (evt) => {
    this.#formValidation({destinationCallback: () => {
      if (this._state.destination.name !== evt.target.value) {
        this.updateState({
          destination: {...this.#destinations.filter((destination) => destination.name === evt.target.value)[0]}
        });
      }
    }});
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#parseStateToData(this._state));
  };

  #onEditClick = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #onDeleteClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(this.#parseStateToData(this._state));
  };

  #isDestinationValid = () => {
    const value = this.#dom.get('DESTINATION').value;
    return value !== '' && this.#destinationsNames.includes(value);
  };

  #isPriceValid = () => {
    const value = this.#dom.get('PRICE').value;
    return value !== '' && parseInt(value, 10) > 0;
  };

  #setValidityState = (element, message, isValid) => {
    const parent = element.parentElement;

    element.style.color = isValid ? '' : Color.INVALID;
    parent.style.borderBottomColor = isValid ? '' : Color.INVALID;

    element.setCustomValidity(isValid ? '' : message);
    element.reportValidity();
  };

  #formValidation = debounce((callback = {destinationCallback: null}) => {
    const isDestinationValid = this.#isDestinationValid();
    const isPriceValid = this.#isPriceValid();

    this.#setValidityState(this.#dom.get('DESTINATION'), ErrorMessage.DESTINATION, isDestinationValid);
    this.#setValidityState(this.#dom.get('PRICE'), ErrorMessage.PRICE, isPriceValid);

    if (isDestinationValid && callback.destinationCallback) {
      callback.destinationCallback();
    }

    this.#dom.get('SAVE').disabled = !(isDestinationValid && isPriceValid);
  }, DEBOUNCE_DELAY, false);


  #setDom = () => {
    domItems.forEach((domItem) => {
      this.#dom.set(domItem.name, this.element[domItem.isList ? 'querySelectorAll' : 'querySelector'](domItem.selector));
    });
  };

  #getOffersForType = (type) => this.#allOffers.filter((offer) => offer.type === type)[0].offers.map((offer) => ({...offer}));

  #setOffers = (pointOffers, pointType) => {
    const offersForType = this.#getOffersForType(pointType);
    const pointOffersIds = pointOffers.map((offer) => offer.id);
    return offersForType.map((offer) => ({...offer, isChecked: pointOffersIds.includes(offer.id)}));
  };

  #parseDataToState = (data) => ({
    ...data,
    offers: this.#setOffers(data.offers, data.type),
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  #parseStateToData = (state) => {
    const offers = state.offers.filter((offer) => offer.isChecked).map((offer) => {
      const offerCopy = {...offer};
      delete offerCopy.isChecked;
      return offerCopy;
    });

    const data = {...state, destination: {...state.destination}, offers};
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  };
}
