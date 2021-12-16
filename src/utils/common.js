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

export {
  getRandomInteger,
  isEscKeyCode
};
