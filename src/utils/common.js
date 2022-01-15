import dayjs from 'dayjs';
import {HOURS_IN_DAY, MINUTES_IN_HOUR, NUMBER_OF_CHARACTERS, PAD_STRING} from './const.js';

const KeyCode = {
  ESC: 27,
  ENTER: 13,
  SPACE: 32
};

const isEscKeyCode = (keyCode) => keyCode === KeyCode.ESC;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const debounce = function(func, wait, immediate) {
  let timeout;

  return function executedFunction() {
    const context = this;
    const args = arguments;

    const later = function() {
      timeout = null;

      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};

const sortByTime = (points) => (
  points.sort((pointA, pointB) => {
    const durationPointA = dayjs(pointA.dateTo).diff(pointA.dateFrom, 'minute');
    const durationPointB = dayjs(pointB.dateTo).diff(pointB.dateFrom, 'minute');

    return durationPointB - durationPointA;
  })
);

const sortByPrice = (points) => points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);

const filterPast = (points) => points.filter((point) => Date.now() - Date.parse(point.dateTo) > 0);
const filterFuture = (points) => points.filter((point) => Date.now() - Date.parse(point.dateFrom) < 0);

const SortPointsMethodMap = {
  TIME: sortByTime,
  PRICE: sortByPrice
};

const FilterPointsMethodMap = {
  EVERYTHING: (points) => points,
  PAST: filterPast,
  FUTURE: filterFuture
};

const getDurationInMinutes = (dateFrom, dateTo) => dayjs(dateTo).diff(dateFrom, 'minute');

const getDurationString = (durationInMinutes) => {
  const durationInHours = durationInMinutes ? Math.floor(durationInMinutes / MINUTES_IN_HOUR) : 0;
  const durationInDays = durationInHours ? Math.floor(durationInHours / HOURS_IN_DAY) : 0;

  const durationDaysString = durationInDays ? `${String(durationInDays).padStart(NUMBER_OF_CHARACTERS, PAD_STRING)}D` : '';
  const durationHoursString = durationInHours ? `${String(durationInHours % HOURS_IN_DAY).padStart(NUMBER_OF_CHARACTERS, PAD_STRING)}H` : '';
  const durationMinutesString = durationInMinutes ? `${String(durationInMinutes % MINUTES_IN_HOUR).padStart(NUMBER_OF_CHARACTERS, PAD_STRING)}M` : '';

  return `${durationDaysString} ${durationHoursString} ${durationMinutesString}`.trim();
};

export {
  getRandomInteger,
  isEscKeyCode,
  SortPointsMethodMap,
  FilterPointsMethodMap,
  debounce,
  getDurationString,
  getDurationInMinutes
};
