import dayjs from 'dayjs';
import {getRandomInteger} from '../utils.js';
import {generateDestination, DESTINATIONS_NAMES} from './destination.js';
import {generateOffer} from './offer.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BasePrice = {
  MIN: 20,
  MAX: 1100
};

const TimeGap = {
  MIN: 40,
  MAX: 120
};

const DESTINATION_COUNT = DESTINATIONS_NAMES.length;
let currentDate = dayjs();

const generateDate = () => {
  const date = dayjs(currentDate).add(getRandomInteger(TimeGap.MIN, TimeGap.MAX), 'minute').toDate();
  currentDate = date;

  return date;
};

const generatePoint = (id, destinationId) => {
  const type = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];

  return {
    basePrice: getRandomInteger(BasePrice.MIN, BasePrice.MAX),
    dateFrom: generateDate(),
    dateTo: generateDate(),
    destination: generateDestination(destinationId),
    id,
    isFavorite: Boolean(getRandomInteger()),
    additionalOffer: generateOffer(type),
    type: type
  };
};

export {
  generatePoint,
  DESTINATION_COUNT
};


