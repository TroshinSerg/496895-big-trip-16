import AbstractView from './abstract-view.js';
import { MenuItem } from '../utils/const.js';

const MODIFIER_CLASS = 'trip-tabs__btn--active';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn ${MODIFIER_CLASS}" data-id="${MenuItem.TABLE}" href="#">${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn" data-id="${MenuItem.STATS}" href="#">${MenuItem.STATS}</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setOnMenuClick = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#onMenuClick);
  }

  setActiveMenuItem = (itemId) => {
    const menuItems = this.element.querySelectorAll('.trip-tabs__btn');

    menuItems.forEach((menuItem) => {
      menuItem.classList[menuItem.dataset.id === itemId ? 'add' : 'remove'](MODIFIER_CLASS);
    });
  };

  #onMenuClick = (evt) => {
    evt.preventDefault();
    const menuItemId = evt.target.dataset.id;

    this.setActiveMenuItem(menuItemId);
    this._callback.menuClick(menuItemId);
  };
}
