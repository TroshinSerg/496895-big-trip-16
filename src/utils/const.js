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

export {
  FilterType,
  UpdateType,
  UserAction,
  SortType
};
