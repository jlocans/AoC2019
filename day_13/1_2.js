const { puzzleInput } = require('./input');
const IntCodeComputer = require('../intCodeComputer');
const ArcadeGame = require('./arcadeGame');

solve(puzzleInput, false);

function solve(input) {
  const computer = new IntCodeComputer(input);
  const game = new ArcadeGame();

  computer.intCode[0] = 2;

  while (!computer.mustHalt) {
    const output = computer.executeInstruction(game.joystickPos);

    if (output !== null) {
      game.processInput(output);
    }
  }
}
