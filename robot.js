class Robot {
    constructor(gridSize) {
        this.movesCount = 0;
        this.paintedPanels = new Set();
        this.grid = initGrid(gridSize);
        this.x = Math.floor(gridSize / 2);
        this.y = Math.floor(gridSize / 2);
        this.directionAngle = 90;
        this.color = 1;
        this.waitingColor = true;

        console.log('Initiating robot...');
        console.log('gridSize', gridSize);
        console.log('x', this.x);
        console.log('y', this.y);

        this.processInput = function (input) {
            if (this.waitingColor) {
                this.color = input;
            }
            else {
                this.move(input);
            }
        }

        this.move = function (turnVal) {
            this.directionAngle = ((turnVal === 0 ? this.directionAngle + 90 : this.directionAngle - 90) + 360) % 360;

            switch (this.directionAngle) {
                case 0:
                    this.x++;
                    break;
                case 90:
                    this.y--;
                    break;
                case 180:
                    this.x--;
                    break;
                case 270:
                    this.y++;
                    break;
                default: throw ('Incorrect angle');
            }

            this.waitingColor = true;
        }
    }

    get color() {
        return this.grid[this.y][this.x];
    }

    set color(color) {
        if (this.color !== color) {
            this.paintedPanels.add(`${this.x},${this.y}`);
        }

        this.grid[this.y][this.x] = color;
        this.waitingColor = false;
    }
}

function initGrid(size) {
    return Array(size)
        .fill(null)
        .map(_ => Array(size).fill(0));
}

module.exports = Robot;