import {getRandomInteger} from '../utils.js';

const DESTINATIONS_NAMES = ['Amsterdam', 'Chamonix', 'Geneva'];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const PHOTO_URL = 'http://picsum.photos/248/152?r=';

const NumberOfSentences = {
  MIN: 1,
  MAX: 5
};

const NumberOfPictures = {
  MIN: 1,
  MAX: 5
};

const generateDescription = () => {
  const sentencesCount = getRandomInteger(NumberOfSentences.MIN, NumberOfSentences.MAX);
  const descriptionSentences = DESCRIPTION.split('. ');
  const description = `${descriptionSentences.slice(0, sentencesCount).join('. ')}.`;

  return description;
};

const generatePictures = () => {
  const picturesCount = getRandomInteger(NumberOfPictures.MIN, NumberOfPictures.MAX);
  const pictures = [];

  for (let i = 1; i <= picturesCount; i++) {
    pictures.push({
      src: `${PHOTO_URL}${Math.random()}`,
      description: 'Lorem ipsum dolor sit amet'
    });
  }

  return pictures;
};

const generateDestination = (id) => ({
  description: generateDescription(),
  name: DESTINATIONS_NAMES[id],
  pictures: generatePictures()
});

export {
  generateDestination,
  DESTINATIONS_NAMES
};
