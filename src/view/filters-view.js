import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${filter.type === currentFilterType ? 'checked' : ''}${filter.isAvailable ? '' : ' disabled'}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
  </div>`
);

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsString = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsString}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setOnFormChange = (callback) => {
    this._callback.formChange = callback;
    this.element.addEventListener('change', this.#onFormChange);
  };

  #onFormChange = (evt) => {
    const filterInput = evt.target.closest('.trip-filters__filter-input');

    if (filterInput) {
      evt.preventDefault();
      this._callback.formChange(filterInput.value);
    }
  }
}
