const { Engine } = require("node-uci");
const config = require("../config");

class Stockfish {
  constructor() {
    this.engine = new Engine(config.engine);
  }

  async getBestMove(position, level = 5) {
    const engine = this.engine;
    await engine.init();
    await engine.isready();
    await engine.position(position);
    await engine.setoption("Skill Level", String(level));
    const result = await engine.go({ movetime: 1000 });
    const bestMove = {
      from: result.bestmove.substring(0, 2),
      to: result.bestmove.substring(2, 4),
    };
    if (result.bestmove.length > 4) {
      bestMove.promotion = result.bestmove.substring(4);
    }
    await engine.quit();
    return bestMove;
  }

  generateImageLink(position, turn, fromBlack) {
    let link = position.split(" ")[0];
    link = config.fen2img + link + "?turn=";
    if (turn === "black") link += "black";
    else link += "white";
    if (fromBlack) link += "&pov=black";
    return link;
  }
}

module.exports.Stockfish = Stockfish;
