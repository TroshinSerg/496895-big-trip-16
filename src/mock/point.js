import dayjs from 'dayjs';
import {getRandomInteger} from '../utils.js';
import {generateDestination, DESTINATIONS_NAMES} from './destination.js';
import {generateOffer} from './offer.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const BasePrice = {
  MIN: 20,
  MAX: 1100
};

const DESTINATION_COUNT = DESTINATIONS_NAMES.length;
let currentDate = dayjs().toDate();

const generateDate = () => {
  const TimeGap = {
    MIN: 40,
    MAX: 120
  };

  const date = dayjs(currentDate).add(getRandomInteger(TimeGap.MIN, TimeGap.MAX), 'minute').toDate();
  currentDate = date;

  return date;
};

const generatePoint = (id, destinationId) => {
  const type = POINT_TYPES[getRandomInteger(0, POINT_TYPES.length - 1)];

  return {
    basePrice: getRandomInteger(BasePrice.MIN, BasePrice.MAX),
    dateFrom: generateDate(),//'2019-07-10T22:55:56.845Z',
    dateTo: generateDate(),//'2019-07-11T11:22:13.375Z',
    destination: generateDestination(destinationId),
    id: id,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: generateOffer(type),
    type: type
  };
};

export {
  generatePoint,
  DESTINATION_COUNT
};


