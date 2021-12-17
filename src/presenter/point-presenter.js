import {isEscKeyCode} from '../utils/common.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class PointPresenter {
  #pointsListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;

  #point = null;

  constructor(pointsListContainer) {
    this.#pointsListContainer = pointsListContainer;
  }

  init = (point) => {
    this.#point = point;
    this.#pointComponent = new PointView(this.#point);
    this.#editPointComponent = new EditPointView(this.#point);

    this.#pointComponent.setEditClickHandler(() => {
      this.#replaceToEditPoint();
      document.addEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#editPointComponent.setformSubmitHandler(() => {
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    this.#editPointComponent.setEditClickHandler(() => {
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    });

    render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
  };

  #replaceToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
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
  };
}
