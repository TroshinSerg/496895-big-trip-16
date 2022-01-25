import {isEscKeyCode} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../utils/const.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #changeData = null;
  #editPointComponent = null;
  #addPointButton = null;
  #onDeleteClick = null;

  constructor(pointsListContainer, changeData, onDeleteClick) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#onDeleteClick = onDeleteClick;
  }

  init = (button, offers, destinations) => {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#addPointButton = button;
    this.#addPointButton.disabled = true;
    this.#editPointComponent = new EditPointView(null, offers, destinations);

    this.#editPointComponent.setOnFormSubmit((pointsItem) => {
      this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, pointsItem);
    });

    this.#editPointComponent.setOnDeleteClick(() => {
      this.destroy();
      this.#onDeleteClick();
    });

    render(this.#pointsListContainer, this.#editPointComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#addPointButton.disabled = false;
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };

  setViewSavingState = () => {
    this.#editPointComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAbortingState = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  #onEscapeKeyDown = (evt) => {
    if (isEscKeyCode(evt.keyCode)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
