const puzzleInput = require('./input');

console.log(solve(puzzleInput));
solve2(puzzleInput);

function solve(input) {
  const pixels = toPixels(input);
  const layers = toChunks(pixels, 25 * 6);

  const digits = layers.map(l => ({
    zeroes: digitsInLayer(l, 0),
    ones: digitsInLayer(l, 1),
    twos: digitsInLayer(l, 2)
  }));

  const leastZeroes = digits.sort((a, b) => a.zeroes - b.zeroes)[0];

  return leastZeroes.ones * leastZeroes.twos;
}

function solve2(input) {
  const pixels = toPixels(input);
  const layers = toChunks(pixels, 25 * 6);
  let messagePixels = [];

  for (let i = 0; i < 25 * 6; i++) {
    messagePixels.push(getTopPixel(layers, i));
  }

  messagePixels = messagePixels.map(p => p === 0 ? ' ' : p === 1 ? '#' : ' ');

  const messageRows = toChunks(messagePixels, 25);

  messageRows.forEach(r => console.log(r.join('')));
}

function getTopPixel(layers, pixelIndex, layerIndex = 0) {
  const layer = layers[layerIndex];
  const pixel = layer[pixelIndex];

  return pixel == 2
    ? getTopPixel(layers, pixelIndex, layerIndex + 1)
    : pixel;
}

function digitsInLayer(layer, digit) {
  return layer.reduce((res, pixel) => pixel === digit ? res + 1 : res, 0);
}

function toChunks(arr, size) {
  const layers = [];

  for (let i = 0, j = arr.length; i < j; i += size) {
    layers.push(arr.slice(i, i + size));
  }

  return layers;
}

function toPixels(input) {
  return input.split('').map(x => +x);
}