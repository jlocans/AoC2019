const input = require('./input');

const solve = input.split('\n')
  .reduce((acc, val) => acc + Math.floor(+val / 3) - 2, 0);

const solve2 = input.split('\n')
  .map(x => massToFuels(+x))
  .reduce((acc, val) => acc.concat(val), [])
  .reduce((acc, val) => acc + val, 0)

function massToFuels(mass) {
  const fuels = [];

  while (mass > 5) {
    mass = Math.floor(mass / 3) - 2;
    fuels.push(mass);
  }

  return fuels;
}

console.log(solve);
console.log(solve2);