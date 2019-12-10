const assert = require('assert');
const puzzleInput = require('./input');
const IntCodeComputer = require('../intCodeComputer');

test();
solve(1);
solve(2);

function solve(input) {
    const computer = new IntCodeComputer(puzzleInput);

    while (!computer.mustHalt) {
        const output = computer.executeInstruction(input);

        if (output != null) {
            console.log(output);
        }
    }
}

function test() {
    const testInput1 = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
    const testInput2 = '1102,34915192,34915192,7,4,7,99,0';
    const testInput3 = '104,1125899906842624,99';

    assert(testInput1 === executeTestInput(testInput1).join(','));
    assert(executeTestInput(testInput2).join(',').length === 16);
    assert(executeTestInput(testInput3).join(',') === '1125899906842624');
    console.log('All test passed successfully');
}

function executeTestInput(input) {
    const computer = new IntCodeComputer(input);
    const outputs = [];

    while (!computer.mustHalt) {
        const output = computer.executeInstruction();

        if (output != null) {
            outputs.push(output);
        }
    }

    return outputs;
}
