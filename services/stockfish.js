var Engine = require("uci");
const config = require("../config");

class Stockfish {
  constructor() {
    this.engine = new Engine(config.engine);
  }

  async getBestMove(position, level = 5) {
    const engine = this.engine;
    try {
      const bestMove = await engine
        .runProcess()
        .then(function () {
          return engine.uciNewGameCommand();
        })
        .then(function () {
          return engine.setOptionCommand("Skill Level", level);
        })
        .then(function () {
          return engine.positionCommand(position);
        })
        .then(function () {
          return engine.goInfiniteCommand();
        })
        .delay(1000)
        .then(function () {
          return engine.stopCommand();
        })
        .finally(() => {
          engine.quitCommand();
        });
      return bestMove;
    } catch (err) {
      console.log(err);
    }
  }

  async generateImageLink(position) {
    const fen = position.split(" ")[0];
    return config.fen2img + fen;
  }
}

module.exports.Stockfish = Stockfish;
