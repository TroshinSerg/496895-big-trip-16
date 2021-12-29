import {isEscKeyCode} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../utils/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #changeMode = null;
  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListContainer, changeData, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#editPointComponent = new EditPointView(this.#point);

    this.#pointComponent.setOnEditClick(() => {
      this.#replaceToEditPoint();
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointComponent.setOnIsFavoriteClick(() => {
      this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
    });

    this.#editPointComponent.setOnFormSubmit((point) => {
      this.#changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#editPointComponent.setOnEditClick(() => {
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceToPoint();
    }
  };

  #replaceToPoint = () => {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscKeyCode(evt.keyCode)) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  #replaceToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };
}
