const puzzleInput = require('./input');
const IntCodeComputer = require('../intCodeComputer');
const Robot = require('../robot');

console.log(solve(puzzleInput, 0));
console.log(solve(puzzleInput, 1));

function solve(input, initialColor) {
    const computer = new IntCodeComputer(input);
    const robot = new Robot(getEstimatedGridSize(input), initialColor);

    while (!computer.mustHalt) {
        const output = computer.executeInstruction(robot.color);

        if (output !== null)
            robot.processInput(output);
    }

    robot.grid.forEach(r => {
        console.log(r.map(c => c ? '#' : ' ').join(''));
    });

    return robot.paintedPanels.size;
}

function getEstimatedGridSize(input) {
    const rgx = /,(?:4|104),/gi;
    const moveCommandsCount = input.match(rgx).length / 2;
    const maxDistance = Math.floor((moveCommandsCount + 1) / 2);

    return maxDistance * 8 + 1; // trial and error tbh
}