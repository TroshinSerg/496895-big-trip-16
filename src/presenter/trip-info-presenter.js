import TripInfoView from '../view/trip-info-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor(tripInfoContainer, pointsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#onModelEvent);
  }

  init = () => {
    const points = this.#pointsModel.points;
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
      render(this.#tripInfoContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #onModelEvent = () => {
    this.init();
  }

  #createTripInfoData = (items = []) => {
    const destinationsNames = new Set();
    let totalPrice = 0;
    let startDateInSeconds = new Date(items[0].dateFrom).getTime();
    let endDateInSeconds = 0;

    items.forEach((point) => {
      totalPrice += point.basePrice;

      if (point.additionalOffer.offers.length) {
        totalPrice += point.additionalOffer.offers
          .filter((offer) => offer.isChecked)
          .reduce((totalOfferPrice, offer) => totalOfferPrice + offer.price, 0);
      }

      destinationsNames.add(point.destination.name);

      // Если дата начала последующих точек маршрута ранее, чем дата старта маршрута - перезаписываем стартовую дату
      startDateInSeconds = Math.min(startDateInSeconds, new Date(point.dateFrom).getTime());

      // Если дата окончания последующих точек маршрута позже, чем дата окончания маршрута - перезаписываем дату окончания маршрута
      endDateInSeconds = Math.max(endDateInSeconds, new Date(point.dateTo).getTime());
    });

    const route = [...destinationsNames].join(' — ');// доработать чтобы при четырех точках показывались две крайние и многоточие
    const startDate = new Date(startDateInSeconds);
    const endDate = new Date(endDateInSeconds);

    return {
      route,
      totalPrice,
      startDate,
      endDate
    };
  };
}
