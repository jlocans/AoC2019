const puzzleInput = require('./input');

console.log(solve(puzzleInput));
console.log(solve2(puzzleInput));

function solve(input) {
  const [start, end] = input.split('-').map(x => +x);
  let res = 0;

  for (let i = start; i <= end; i++) {
    if (isAscending(i) && hasBuddies(i))
      res++;
  }

  return res;
}

function solve2(input) {
  const [start, end] = input.split('-').map(x => +x);
  let res = 0;

  for (let i = start; i <= end; i++) {
    if (isAscending(i) && hasCouple(i))
      res++;
  }

  return res;
}

function isAscending(number) {
  return number.toString()
    .split('')
    .sort()
    .join('') === number.toString();
}

function hasBuddies(number) {
  return /(\d)(\1)/.test(number.toString());
}

function hasCouple(number) {
  const matches = number.toString().match(/(\d)(\1)+/g);
  return matches && matches.some(m => m.length === 2);
}