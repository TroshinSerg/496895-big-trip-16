import AbstractObservable from './abstract-observable.js';
import {UpdateType} from '../utils/const.js';

export default class TripModel extends AbstractObservable {
  #points = [];
  #offers = [];
  #destinations = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      let points = null;
      const data = await Promise.all([this.#apiService.points, this.#apiService.offers, this.#apiService.destinations]);
      [points, this.#offers, this.#destinations] = [...data];
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint = (updateType, update) => {
    this.#points = this.#points.map((point) => point.id === update.id ? update : point);
    this._notify(updateType, update);
  }

  addPoint = (updateType, update) => {
    this.#points = [update, ...this.#points];
    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }
}
