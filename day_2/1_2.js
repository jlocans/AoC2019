const assert = require('assert');
const puzzleInput = require('./input');
const testInputs = [
  {
    input: '1,0,0,0,99',
    answer: '2,0,0,0,99'
  },
  {
    input: '2,3,0,3,99',
    answer: '2,3,0,6,99'
  },
  {
    input: '2,4,4,5,99,0',
    answer: '2,4,4,5,99,9801'
  },
  {
    input: '1,1,1,4,99,5,6,0,99',
    answer: '30,1,1,4,2,5,6,0,99'
  },
]

test();
solvePart1();
solvePart2();

function solvePart1() {
  const intCode = toIntCode(puzzleInput);
  intCode[1] = 12;
  intCode[2] = 2;

  console.log(solve(intCode)[0]);
}

function solvePart2() {
  main_loop:
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const intCode = toIntCode(puzzleInput);
      
      intCode[1] = i;
      intCode[2] = j;

      const output = solve(intCode)[0];

      if (output === 19690720) {
        console.log (100 * i + j);
        break main_loop;
      }
    }
  }
}

function solve(intCode) {
  let index = 0;

  while (intCode[index] !== 99) {
    const [instruction, src1Addrs, src2Addrs, targetAddrs] = intCode.slice(index, index + 4);
    intCode[targetAddrs] = addOrMultiply(instruction, intCode[src1Addrs], intCode[src2Addrs]);
    index += 4;
  }

  return intCode;
}

function addOrMultiply(instruction, src1, src2) {
  return instruction === 1
    ? src1 + src2
    : src1 * src2;
}

function test() {
  testInputs.forEach(input => {
    const answer = solve(toIntCode(input.input)).join();
    assert(answer === input.answer);
  });

  console.log('Tests passed successfully');
}

function toIntCode(input) {
  return input.split(',').map(x => +x);
}