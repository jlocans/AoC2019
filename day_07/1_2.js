// This is very dirty.

const assert = require('assert');
const IntCodeComputer = require('../intCodeComputer');
const puzzleInput = require('./input');
const testInputs = [
    {
        input: '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0',
        answer: 43210
    },
    {
        input: '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0',
        answer: 54321
    },
    {
        input: '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0',
        answer: 65210
    }
];
const testInputs2 = [
    {
        input: '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5',
        answer: 139629729
    },
    {
        input: '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10',
        answer: 18216
    }
]

test();
console.log(solve(puzzleInput));
console.log(solve2(puzzleInput));

function solve(input) {
    const phaseSettingsPermutations = Array.from(permute([0, 1, 2, 3, 4]));

    const res = phaseSettingsPermutations.reduce((maxOutput, phaseSettings) => {
        const endOutput = phaseSettings.reduce((output, phase) => {
            const computer = new IntCodeComputer(input);
            let firstOpCode3Processed = false;
            let newOutput = output;

            while (!computer.mustHalt) {
                const opCode3Input = firstOpCode3Processed ? output : phase;

                if (computer.opCode === 3)
                    firstOpCode3Processed = true;

                newOutput = computer.executeInstruction(opCode3Input);
            }

            return newOutput;
        }, 0);

        return Math.max(maxOutput, endOutput);
    }, 0);

    return res;
}

function solve2(input) {
    const phaseSettingsPermutations = Array.from(permute([5, 6, 7, 8, 9]));

    const res = phaseSettingsPermutations.reduce((maxOutput, phaseSettings) => {
        let currentPhaseIndex = 0, phaseOutput, isEnd = false;
        phaseSettings = phaseSettings.map(phase => ({
            phase,
            computer: new IntCodeComputer(input),
            input: 0,
            phaseUsedAsInput: false
        }));

        while (!isEnd) {
            const currentPhase = phaseSettings[currentPhaseIndex];
            phaseOutput = executeUntilOutput(currentPhase.computer, currentPhase.input, currentPhase.phaseUsedAsInput ? null : currentPhase.phase);

            currentPhase.phaseUsedAsInput = true;

            currentPhaseIndex = getNextPhaseIndex(currentPhaseIndex);
            phaseOutput = phaseOutput || currentPhase.input;
            isEnd = currentPhase.computer.mustHalt && currentPhaseIndex === 0;
            phaseSettings[currentPhaseIndex].input = phaseOutput;
        }

        return Math.max(phaseOutput, maxOutput);
    }, 0);

    return res;
}

function executeUntilOutput(computer, input, phase) {
    let output = undefined;
    let firstOpCode3Processed = false;

    while (output == null && !computer.mustHalt) {
        const opCode3Input = firstOpCode3Processed ? input : (phase || input);

        if (computer.opCode === 3)
            firstOpCode3Processed = true;

        const newOutput = computer.executeInstruction(opCode3Input);
        output = newOutput || output;
    }

    return output;
}

function getNextPhaseIndex(currentIndex) {
    return currentIndex === 4 ? 0 : currentIndex + 1;
}

function* permute(a, n = a.length) {
    if (n <= 1) yield a.slice();
    else for (let i = 0; i < n; i++) {
        yield* permute(a, n - 1);
        const j = n % 2 ? 0 : i;
        [a[n - 1], a[j]] = [a[j], a[n - 1]];
    }
}

function test() {
    testInputs.forEach(ti => assert(ti.answer === solve(ti.input)));
    testInputs2.forEach(ti => assert(ti.answer === solve2(ti.input)));
    console.log('All tests passed successfully');
}