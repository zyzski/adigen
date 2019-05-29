const randomMinMax = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

module.exports = {
  randomMinMax,
};
