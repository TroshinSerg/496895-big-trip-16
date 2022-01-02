import {generatePoint, DESTINATION_COUNT} from './mock/point.js';
import {render, RenderPosition} from './utils/render.js';
import MenuView from './view/menu-view';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');


const POINTS_COUNT = 1;

const points = [...Array(POINTS_COUNT)].map((it, index) => {
  const destinationId = index % DESTINATION_COUNT;
  return generatePoint(index + 1, destinationId);
});

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
pointsModel.points = points;

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);

const menuComponent = new MenuView();
render(navigationElement, menuComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();
tripInfoPresenter.init();
