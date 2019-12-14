class Paddle {
  constructor() {
    this.x = null;

    this.getDir = function ([ballX, _]) {
      return ballX !== null && this.x !== null
        ? Math.sign(ballX - this.x)
        : 0;
    }
  }

  get pos() {
    return this.x;
  }

  set pos(x) {
    this.x = x;
  }
}

module.exports = Paddle;