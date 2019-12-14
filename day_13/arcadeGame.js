const readline = require('readline');
const Ball = require('./ball');
const Paddle = require('./paddle');

class ArcadeGame {
  constructor() {
    this.iterator = 0;
    this.tilesReady = 0;
    this.width = 35;
    this.height = 23;
    this.size = this.width * this.height;
    this.grid = Array(this.height).fill(null).map(_ => Array(this.width).fill(0));
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.blocks = this.remainingBlocks;
    this.ball = new Ball();
    this.paddle = new Paddle();

    this.processInput = function (input) {
      switch (this.iterator) {
        case 0:
          this.x = input;
          this.iterator++;
          break;
        case 1:
          this.y = input;
          this.iterator++;
          break;
        case 2:
          if (this.x === -1 && this.y === 0) {
            this.score = input;
          }
          else {
            this.grid[this.y] = this.grid[this.y] || [];
            this.grid[this.y][this.x] = input;

            if (input === 4) {
              this.ball.pos = [this.x, this.y];
            }
            if (input === 3) {
              this.paddle.pos = this.x;
            }

          }
          this.iterator = 0;
          this.tilesReady++;

          if (this.tilesReady === this.size) {
            this.blocks = this.remainingBlocks;
          }

          // We want to draw initial grid instantly
          if (this.tilesReady < this.size) {
            this.drawScreen();
          }
          else {
            (screen => setTimeout(() => this.drawScreen(screen)
              , (this.tilesReady - this.size) * 6))(this.screen);
          }
          break;
      }
    }

    this.drawScreen = function (screen) {
      screen = screen || this.screen;
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      process.stdout.write(screen);
    }
  }

  get screen() {
    return this.grid.reduce((res, row, rowIndex) => {
      const line = row.map((t, colIndex) => getTileSymbol(t, rowIndex, colIndex)).join('');
      return res + line + '\n';
    }, `Score: ${this.score}
Blocks: ${this.blocks}
Remaining blocks: ${this.remainingBlocks}\n\n`);
  }

  get joystickPos() {
    return this.paddle.getDir(this.ball.pos);
  }

  get remainingBlocks() {
    return this.grid.reduce((res, row) => res + row.filter(t => t === 2).length, 0);
  }
}

function getTileSymbol(tile, rowIndex, colIndex) {
  switch (tile) {
    case 0: return ' ';
    case 1:
      if (rowIndex === 0 && colIndex === 0)
        return '┌';
      if (rowIndex === 0 && colIndex === 34)
        return '┐';
      if (rowIndex === 0)
        return '─';
      return '│';
    case 2: return '■';
    case 3: return '═';
    case 4: return 'o';
    default: throw ("Incorrect tile");
  }
}

module.exports = ArcadeGame;