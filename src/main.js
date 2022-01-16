import {MenuItem} from './utils/const.js';
import {generatePoint, DESTINATION_COUNT} from './mock/point.js';
import {remove, render, RenderPosition} from './utils/render.js';
import MenuView from './view/menu-view.js';
import StatsView from './view/stats-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-service.js';

const tripMainElement = document.querySelector('.trip-main');
const pageMainContainerElement = document.querySelector('.page-main .page-body__container');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const eventAddBtn = tripMainElement.querySelector('.trip-main__event-add-btn');

const POINTS_COUNT = 15;
let isStats = false;

const AUTHORIZATION = 'Basic hS2fhthtgkghkyurf';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = index % DESTINATION_COUNT;
  return generatePoint(index + 1, destinationId);
});

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
pointsModel.points = points;

const tripPresenter = new TripPresenter(pageMainContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);

const changeStatusPresenters = (options = {destroy: false}) => {
  const method = options.destroy ? 'destroy' : 'init';
  tripPresenter[method]();
  filterPresenter[method]();
};

const menuComponent = new MenuView();
let statsComponent = null;
render(navigationElement, menuComponent, RenderPosition.BEFOREEND);

const showEventsTable = () => {
  changeStatusPresenters();
  remove(statsComponent);
  isStats = false;
};

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      showEventsTable();
      break;
    case MenuItem.STATS:
      statsComponent = new StatsView(pointsModel.points);
      changeStatusPresenters({destroy: true});
      render(pageMainContainerElement, statsComponent, RenderPosition.BEFOREEND);
      isStats = true;
      break;
  }
};

menuComponent.setOnMenuClick(onMenuClick);
changeStatusPresenters();
tripInfoPresenter.init();

eventAddBtn.addEventListener('click', (evt) => {
  evt.preventDefault();

  if (isStats) {
    showEventsTable();
    menuComponent.setActiveMenuItem(MenuItem.TABLE);
  }

  tripPresenter.createPoint(eventAddBtn);
});
