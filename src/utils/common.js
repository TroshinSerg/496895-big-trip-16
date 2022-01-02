import dayjs from 'dayjs';

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

export {
  getRandomInteger,
  isEscKeyCode,
  SortPointsMethodMap,
  FilterPointsMethodMap
};
