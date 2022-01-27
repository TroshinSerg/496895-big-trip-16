const DEBOUNCE_DELAY = 100;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const NUMBER_OF_CHARACTERS = 2;
const PAD_STRING = '0';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SortType = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  FUTURE: 'future',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const Color = {
  INVALID: 'red',
};

const ErrorMessage = {
  PRICE: 'Only a positive integer is allowed',
  DESTINATION: 'Only values from the suggested list are allowed',
};

const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export {
  FilterType,
  UpdateType,
  UserAction,
  SortType,
  Color,
  ErrorMessage,
  DEBOUNCE_DELAY,
  MenuItem,
  EVENT_TYPES,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  NUMBER_OF_CHARACTERS,
  PAD_STRING,
  State
};
