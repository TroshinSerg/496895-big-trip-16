import FiltersView from '../view/filters-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything'
      },
      {
        type: FilterType.FUTURE,
        name: 'Future'
      },
      {
        type: FilterType.PAST,
        name: 'Past'
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setOnFormChange(this.#onFormChange);

    if (prevFilterComponent === null) {
      //render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

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
