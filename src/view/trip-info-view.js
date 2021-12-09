import {createElement} from '../render';
import dayjs from 'dayjs';

const generateEventPeriod = (startDate, endDate) => {
  const isSameMonth = dayjs(startDate).get('month') === dayjs(endDate).get('month');
  const dayjsMonthParam = isSameMonth ? '' : 'MMM ';

  return `${dayjs(startDate).format('MMM DD')}&nbsp;—&nbsp;${dayjs(endDate).format(`${dayjsMonthParam}DD`)}`;
};

const createTripInfoTemplate = ({route, totalPrice, startDate, endDate}) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">${generateEventPeriod(startDate, endDate)}</p>
    </div>

    <p class="trip-info__cost">
      Total: €&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>
  </section>`
);

export default class TripInfoView {
  #element = null;
  #data = null;

  constructor(data) {
    this.#data = data;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTripInfoTemplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}