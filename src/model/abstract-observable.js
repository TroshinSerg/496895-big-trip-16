export default class AbstractObservable {
  #observers = new Set();

  constructor() {
    if (new.target === AbstractObservable) {
      throw new Error('Can\'t instantiate AbstractObservable, only concrete one.');
    }
  }

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
