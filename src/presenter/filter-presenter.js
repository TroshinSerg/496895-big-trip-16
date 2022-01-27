import FiltersView from '../view/filters-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class FilterPresenter {
  #filterContainerElement = null;
  #filterModel = null;
  #filterComponent = null;
  #tripModel = null;
  #filters = null;

  constructor(filterContainerElement, filterModel, tripModel) {
    this.#filterContainerElement = filterContainerElement;
    this.#filterModel = filterModel;
    this.#tripModel = tripModel;
  }

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        isAvailable: false
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isAvailable: false
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isAvailable: false
      }
    ];
  }

  init = () => {
    this.#filters = this.filters.map((filter) => ({...filter}));
    const prevFilterComponent = this.#filterComponent;

    this.#setAvailability();
    this.#filterComponent = new FiltersView(this.#filters, this.#filterModel.filter);
    this.#filterComponent.setOnFormChange(this.#onFormChange);

    this.#filterModel.addObserver(this.#onModelEvent);
    this.#tripModel.addObserver(this.#onModelEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainerElement, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#tripModel.removeObserver(this.#onModelEvent);
    this.#filterModel.removeObserver(this.#onModelEvent);
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  };

  #setAvailability = () => {
    const points = this.#tripModel.points;

    if (points.length === 0) {
      return;
    }

    const everythingFilterItem = this.#filters.find((filter) => filter.type === FilterType.EVERYTHING);
    const futureFilterItem = this.#filters.find((filter) => filter.type === FilterType.FUTURE);
    const pastFilterItem = this.#filters.find((filter) => filter.type === FilterType.PAST);

    everythingFilterItem.isAvailable = true;

    for (const point of points) {
      if (futureFilterItem.isAvailable && pastFilterItem.isAvailable) {
        break;
      }

      if (!futureFilterItem.isAvailable) {
        futureFilterItem.isAvailable = Date.now() - Date.parse(point.dateFrom) <= 0;
      }

      if (!pastFilterItem.isAvailable) {
        pastFilterItem.isAvailable = Date.now() - Date.parse(point.dateTo) > 0;
      }
    }
  };

  #onModelEvent = () => {
    this.init();
  }

  #onFormChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
