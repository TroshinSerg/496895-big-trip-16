import {getRandomInteger} from '../utils.js';

const OfferPrice = {
  MIN: 5,
  MAX: 200
};

const offerTitles = [
  {
    type: 'taxi',
    titles: ['Order Uber', 'Add luggage', 'Upgrade to a comfort class', 'Upgrade to a business class', 'Upgrade to a premium class']
  },
  {
    type: 'bus',
    titles: ['Add luggage', 'Switch to comfort', 'Choose seats', 'Add meal', 'Switch to comfort']
  },
  {
    type: 'train',
    titles: ['Upgrade to a reserved seat', 'Upgrade to a compartment', 'Upgrade to a sleeping', 'Add luggage', 'Add meal']
  },
  {
    type: 'ship',
    titles: ['Upgrade to a comfort class', 'Upgrade to a business class', 'Upgrade to a premium class', 'Add luggage','Add meal']
  },
  {
    type: 'drive',
    titles: ['Reant a moto', 'Rent a car', 'Rent a car with a driver', 'Minibus rental', 'Minibus rental with a driver']
  },
  {
    type: 'flight',
    titles: ['Add luggage', 'Add meal', 'Switch to comfort', 'Choose seats', 'Travel by train']
  },
  {
    type: 'check-in',
    titles: ['Add breakfast', 'Add lunch', 'Add supper', 'Add coffee', 'Add tea']
  },
  {
    type: 'sightseeing',
    titles: ['Book tickets', 'Lunch in city', 'Personal guide', 'Auto-excursion', 'Photo session']
  },
  {
    type: 'restaurant',
    titles: ['Add breakfast', 'Add lunch', 'Add supper', 'Choose seats', 'Live music']
  }
];

const generateOffers = (type) => {
  const titles = offerTitles.find((it) => it.type === type).titles;

  return titles.map((it, index) => ({
    id: index + 1,
    title: it,
    price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
    isChecked: Boolean(getRandomInteger(0, 1))
  }));
};

export const generateOffer = (type) => ({
  type,
  offers: generateOffers(type)
});
