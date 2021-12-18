import {isEscKeyCode} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

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

    this.#pointComponent.setEditClickHandler(() => {
      this.#replaceToEditPoint();
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#pointComponent.setIsFavoriteClickHandler(() => {
      this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
    });

    this.#editPointComponent.setFormSubmitHandler(() => {
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#editPointComponent.setEditClickHandler(() => {
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    //if (this.#pointsListContainer.element.contains(prevPointComponent.element)) {
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    //if (this.#pointsListContainer.element.contains(prevEditPointComponent.element)) {
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
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscKeyCode(evt.keyCode)) {
      evt.preventDefault();
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  #replaceToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode  = Mode.EDITING;
  };
}
