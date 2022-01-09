const SortType = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future'
};

const Color = {
  INVALID: 'red'
};

const ErrorMessage = {
  PRICE: 'INVALID PRICE VALUE',
  DESTINATION: 'INVALID DESTINATION VALUE'
};

const DEBOUNCE_DELAY = 100;

export {
  FilterType,
  UpdateType,
  UserAction,
  SortType,
  Color,
  ErrorMessage,
  DEBOUNCE_DELAY
};
