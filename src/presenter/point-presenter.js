import {isEscKeyCode} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {State} from '../utils/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainerElement = null;
  #changeData = null;
  #changeMode = null;
  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(pointsListContainerElement, changeData, changeMode, offers, destinations) {
    this.#pointsListContainerElement = pointsListContainerElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#editPointComponent = new EditPointView(this.#point, this.#offers, this.#destinations);

    this.#pointComponent.setOnEditClick(this.#onEditBtnPointComponentClick);
    this.#pointComponent.setOnIsFavoriteClick(this.#onIsFavoriteClick);
    this.#editPointComponent.setOnFormSubmit(this.#onFormSubmit);
    this.#editPointComponent.setOnEditClick(this.#onEditBtnEditPointComponentClick);
    this.#editPointComponent.setOnDeleteClick(this.#onDeleteClick);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointsListContainerElement, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
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

  setViewState = (state) => {
    const resetFormState = () => {
      this.#editPointComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#editPointComponent.updateState({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#editPointComponent.updateState({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointComponent.shake();
        this.#editPointComponent.shake(resetFormState);
        break;
    }
  };

  #replaceToPoint = () => {
    this.#editPointComponent.reset(this.#point);
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #replaceToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscKeyCode(evt.keyCode)) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceToPoint();
      document.removeEventListener('keydown', this.#onEscapeKeyDown);
    }
  };

  #onIsFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onDeleteClick = (pointsItem) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, pointsItem);
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  #onFormSubmit = (pointsItem) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, pointsItem);
  };

  #onEditBtnPointComponentClick = () => {
    this.#replaceToEditPoint();
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  #onEditBtnEditPointComponentClick = () => {
    this.#replaceToPoint();
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };
}
