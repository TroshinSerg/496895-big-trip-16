import {MenuItem} from './utils/const.js';
import {remove, render, RenderPosition} from './utils/render.js';
import MenuView from './view/menu-view.js';
import StatsView from './view/stats-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic hS2fhthtgkghkyurf';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const pageMainContainerElement = document.querySelector('.page-main .page-body__container');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const eventAddBtn = tripMainElement.querySelector('.trip-main__event-add-btn');

let isStats = false;
let statsComponent = null;

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const tripModel = new TripModel(apiService);
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter(pageMainContainerElement, tripModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, tripModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, tripModel);
const menuComponent = new MenuView();

const changeStatusPresenters = (options = {destroy: false}) => {
  const method = options.destroy ? 'destroy' : 'init';
  tripPresenter[method]();
  filterPresenter[method]();
};

const showEventsTable = () => {
  changeStatusPresenters();
  remove(statsComponent);
  isStats = false;
};

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (!isStats) {
        return;
      }
      showEventsTable();
      break;
    case MenuItem.STATS:
      if (isStats) {
        return;
      }

      statsComponent = new StatsView(tripModel.points);
      changeStatusPresenters({destroy: true});
      render(pageMainContainerElement, statsComponent, RenderPosition.BEFOREEND);
      isStats = true;
      break;
  }
};

menuComponent.setOnMenuClick(onMenuClick);
render(navigationElement, menuComponent, RenderPosition.BEFOREEND);
changeStatusPresenters();
tripInfoPresenter.init();
tripModel.init();

eventAddBtn.addEventListener('click', (evt) => {
  evt.preventDefault();

  if (isStats) {
    showEventsTable();
    menuComponent.setActiveMenuItem(MenuItem.TABLE);
  }

  tripPresenter.createPoint(eventAddBtn);
});
