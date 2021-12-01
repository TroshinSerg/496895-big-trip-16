import {getRandomInteger} from '../utils.js';

const OfferPrice = {
  MIN: 5,
  MAX: 200
};

const offerTitles = [
  {
    type: 'taxi',
    titles: [{title: 'Order Uber', mod: 'uber'}, {title: 'Add luggage', mod: 'luggage'}, {title: 'Upgrade to a comfort class', mod: 'comfort'}, {title: 'Upgrade to a business class', mod: 'business'}, {title: 'Upgrade to a premium class', mod: 'premium'}]
  },
  {
    type: 'bus',
    titles: [{title: 'Add luggage', mod: 'luggage'}, {title: 'Switch to comfort', mod: 'comfort'}, {title: 'Choose seats', mod: 'seats'}, {title: 'Add meal', mod: 'meal'}, {title: 'Switch to comfort', mod: 'comfort'}]
  },
  {
    type: 'train',
    titles: [{title: 'Upgrade to a reserved seat', mod: 'reserved-seat'}, {title: 'Upgrade to a compartment', mod: 'compartment'}, {title: 'Upgrade to a sleeping', mod: 'sleeping'}, {title: 'Add luggage', mod: 'luggage'}, {title: 'Add meal', mod: 'meal'}]
  },
  {
    type: 'ship',
    titles: [{title: 'Upgrade to a comfort class', mod: 'comfort'}, {title: 'Upgrade to a business class', mod: 'business'}, {title: 'Upgrade to a premium class', mod: 'premium'}, {title: 'Add luggage', mod: 'luggage'}, {title: 'Add meal', mod: 'meal'}]
  },
  {
    type: 'drive',
    titles: [{title: 'Reant a moto', mod: 'moto'}, {title: 'Rent a car', mod: 'car'}, {title: 'Rent a car with a driver', mod: 'car-with-driver'}, {title: 'Minibus rental', mod: 'minibus'}, {title: 'Minibus rental with a driver', mod: 'minibus-with-driver'}]
  },
  {
    type: 'flight',
    titles: [{title: 'Add luggage', mod: 'luggage'}, {title: 'Add meal', mod: 'meal'}, {title: 'Switch to comfort', mod: 'comfort'}, {title: 'Choose seats', mod: 'seats'}, {title: 'Travel by train', mod: 'train'}]
  },
  {
    type: 'check-in',
    titles: [{title: 'Add breakfast', mod: 'breakfast'}, {title: 'Add lunch', mod: 'lunch'}, {title: 'Add supper', mod: 'supper'}, {title: 'Add coffee', mod: 'coffee'}, {title: 'Add tea', mod: 'tea'}]
  },
  {
    type: 'sightseeing',
    titles: [{title: 'Book tickets', mod: 'tickets'}, {title: 'Lunch in city', mod: 'lunch'}, {title: 'Personal guide', mod: 'guide'}, {title: 'Auto-excursion', mod: 'auto-excursion'}, {title: 'Photo session', mod: 'photo'}]
  },
  {
    type: 'restaurant',
    titles: [{title: 'Add breakfast', mod: 'breakfast'}, {title: 'Add lunch', mod: 'lunch'}, {title: 'Add supper', mod: 'supper'}, {title: 'Choose seats', mod: 'seats'}, {title: 'Live music', mod: 'music'}]
  }
];

const generateOffers = (type) => {
  const titles = offerTitles.find((it) => it.type === type).titles;

  return titles.map((it, index) => ({
    id: index + 1,
    title: it.title,
    mod: it.mod,
    price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
    isChecked: Boolean(getRandomInteger(0, 1))
  }));
};

export const generateOffer = (type) => ({
  type,
  offers: generateOffers(type)
});
