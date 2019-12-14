class Ball {
  constructor() {
    this.x = null;
    this.y = null;
  }

  get pos() {
    return [this.x, this.y];
  }

  set pos([x, y]) {
    this.x = x;
    this.y = y;
  }
}

module.exports = Ball;