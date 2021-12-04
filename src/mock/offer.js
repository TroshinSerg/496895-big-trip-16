import {getRandomInteger} from '../utils.js';

const OfferPrice = {
  MIN: 5,
  MAX: 200
};

const offersMap = {
  taxi: [
    {title: 'Order Uber', mod: 'uber'},
    {title: 'Add luggage', mod: 'luggage'},
    {title: 'Upgrade to a comfort class', mod: 'comfort'},
    {title: 'Upgrade to a business class', mod: 'business'},
    {title: 'Upgrade to a premium class', mod: 'premium'}
  ],
  bus: [
    {title: 'Add luggage', mod: 'luggage'},
    {title: 'Switch to comfort', mod: 'comfort'},
    {title: 'Choose seats', mod: 'seats'},
    {title: 'Add meal', mod: 'meal'},
    {title: 'Switch to comfort', mod: 'comfort'}
  ],
  train: [
    {title: 'Upgrade to a reserved seat', mod: 'reserved-seat'},
    {title: 'Upgrade to a compartment', mod: 'compartment'},
    {title: 'Upgrade to a sleeping', mod: 'sleeping'},
    {title: 'Add luggage', mod: 'luggage'},
    {title: 'Add meal', mod: 'meal'}
  ],
  ship: [
    {title: 'Upgrade to a comfort class', mod: 'comfort'},
    {title: 'Upgrade to a business class', mod: 'business'},
    {title: 'Upgrade to a premium class', mod: 'premium'},
    {title: 'Add luggage', mod: 'luggage'},
    {title: 'Add meal', mod: 'meal'}
  ],
  drive: [
    {title: 'Reant a moto', mod: 'moto'},
    {title: 'Rent a car', mod: 'car'},
    {title: 'Rent a car with a driver', mod: 'car-with-driver'},
    {title: 'Minibus rental', mod: 'minibus'},
    {title: 'Minibus rental with a driver', mod: 'minibus-with-driver'}
  ],
  flight: [
    {title: 'Add luggage', mod: 'luggage'},
    {title: 'Add meal', mod: 'meal'},
    {title: 'Switch to comfort', mod: 'comfort'},
    {title: 'Choose seats', mod: 'seats'},
    {title: 'Travel by train', mod: 'train'}
  ],
  'check-in': [
    {title: 'Add breakfast', mod: 'breakfast'},
    {title: 'Add lunch', mod: 'lunch'},
    {title: 'Add supper', mod: 'supper'},
    {title: 'Add coffee', mod: 'coffee'},
    {title: 'Add tea', mod: 'tea'}
  ],
  sightseeing: [
    {title: 'Book tickets', mod: 'tickets'},
    {title: 'Lunch in city', mod: 'lunch'},
    {title: 'Personal guide', mod: 'guide'},
    {title: 'Auto-excursion', mod: 'auto-excursion'},
    {title: 'Photo session', mod: 'photo'}
  ],
  restaurant: [
    {title: 'Add breakfast', mod: 'breakfast'},
    {title: 'Add lunch', mod: 'lunch'},
    {title: 'Add supper', mod: 'supper'},
    {title: 'Choose seats', mod: 'seats'},
    {title: 'Live music', mod: 'music'}
  ]
};

const generateOffers = (type) => {
  const titles = offersMap[type];

  return titles.map((offer, index) => ({
    id: index + 1,
    title: offer.title,
    mod: offer.mod,
    price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
    isChecked: Boolean(getRandomInteger())
  }));
};

export const generateOffer = (type) => ({
  type,
  offers: generateOffers(type)
});
