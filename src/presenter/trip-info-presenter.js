import TripInfoView from '../view/trip-info-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripInfoPresenter {
  #tripInfoContainerElement = null;
  #tripModel = null;
  #tripInfoComponent = null;
  #maxDestinationsNames = 3;

  constructor(tripInfoContainerElement, tripModel) {
    this.#tripInfoContainerElement = tripInfoContainerElement;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#onModelEvent);
  }

  init = () => {
    const points = this.#tripModel.points;
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const tripInfoData = this.#createTripInfoData(points);
    this.#tripInfoComponent = new TripInfoView(tripInfoData);

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoContainerElement, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #createTripInfoData = (items = []) => {
    const destinationsNames = [];
    let totalPrice = 0;
    let startDateInSeconds = new Date(items[0].dateFrom).getTime();
    let endDateInSeconds = 0;

    items.forEach((point) => {
      totalPrice += point.basePrice;

      if (point.offers.length) {
        totalPrice += point.offers.reduce((totalOfferPrice, offer) => totalOfferPrice + offer.price, 0);
      }

      destinationsNames.push(point.destination.name);

      startDateInSeconds = Math.min(startDateInSeconds, new Date(point.dateFrom).getTime());
      endDateInSeconds = Math.max(endDateInSeconds, new Date(point.dateTo).getTime());
    });

    const route = destinationsNames.length <= this.#maxDestinationsNames ? destinationsNames.join(' — ') : `${destinationsNames[0]} — ... — ${destinationsNames[destinationsNames.length - 1]}`;
    const startDate = new Date(startDateInSeconds);
    const endDate = new Date(endDateInSeconds);

    return {
      route,
      totalPrice,
      startDate,
      endDate
    };
  };

  #onModelEvent = () => {
    this.init();
  };
}
