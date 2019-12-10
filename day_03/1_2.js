// Brute force all the way!
// Indexes. Yikes.

const assert = require('assert');
const puzzleInput = require('./input');
const testInputs = [
  {
    input: `R8,U5,L5,D3
U7,R6,D4,L4`,
    answer: 6,
    answer2: 30
  },
  {
    input: `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`,
    answer: 159,
    answer2: 610
  },
  {
    input: `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`,
    answer: 135,
    answer2: 410
  }
];

test();
console.log(solve(puzzleInput));
console.log(solve2(puzzleInput));

function solve(input) {
  const lines = inputToLines(input);
  const sameLocations = getSameLocations(lines);
  const locationDistances = sameLocations.map(([x, y]) => Math.abs(x) + Math.abs(y));
  const closestDistance = locationDistances.sort((a, b) => a - b)[0];

  return closestDistance;
}

function solve2(input) {
  const lines = inputToLines(input);
  const sameLocations = getSameLocations(lines);
  const soonestDistance = sameLocations.sort((a, b) => a[2] - b[2])[0][2];

  return soonestDistance;
}

function getSameLocations(lines) {
  const [lineOneLocations, lineTwoLocations] = lines.map(line => {
    let steps = 0;

    return line.reduce((points, command) => {
      const lastLocation = points[points.length - 1] || [0, 0];
      const newPoints = Array(command.amount)
        .fill(null)
        .map((_, index) => [
          lastLocation[0] + command.unitVector[0] * (index + 1),
          lastLocation[1] + command.unitVector[1] * (index + 1),
          ++steps
        ]);

      return points.concat(newPoints);
    }, []);
  });

  return lineOneLocations.reduce((res, [lineOneX, lineOneY, lineOneSteps]) => {
    const sameLineTwoLocation = lineTwoLocations.find(([lineTwoX, lineTwoY]) => lineOneX === lineTwoX && lineOneY === lineTwoY);

    if (sameLineTwoLocation) {
      res.push([lineOneX, lineOneY, lineOneSteps + sameLineTwoLocation[2]]);
    }

    return res;
  }, []);
}

function inputToLines(input) {
  return input.split('\n')
    .map(line => line.split(',')
      .map(command => {
        const direction = command.slice(0, 1);
        const amount = command.slice(1);

        return {
          unitVector: directionToUnitVector(direction),
          amount: +amount
        };
      })
    )
}

function directionToUnitVector(direction) {
  switch (direction) {
    case 'R': return [1, 0];
    case 'L': return [-1, 0];
    case 'U': return [0, 1];
    case 'D': return [0, -1];
  }
}

function test() {
  testInputs.forEach(testInput => {
    assert(testInput.answer === solve(testInput.input));
    assert(testInput.answer2 === solve2(testInput.input));
  });
  console.log('Tests passed successfully');
}