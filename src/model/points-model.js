import AbstractObservable from './abstract-observable.js';

export default class PointsModel extends AbstractObservable {
  #points = [];

  set points(points) {
    this.#points = [...points];
  }

  get points() {
    return this.#points;
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
}
