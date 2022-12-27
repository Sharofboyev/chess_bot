const { getPGN, newGame, saveGame, endGame } = require("../models/index");
const { Chess } = require("chess.js");

function getGameStatus(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  // 1 - stalemate, 2 - threefold repetition, 3 - insufficient material, 4 - 50 move rule
  const status = {
    isEnded: false,
    lastMove: "",
    checkMate: false,
    statusCode: 0,
    message: "",
    turn: "white",
  };

  if (chess.isGameOver()) {
    status.isEnded = true;
    if (chess.isCheckmate()) {
      status.mate = true;
      status.message = "Checkmate!";
    } else {
      if (chess.isStalemate) {
        status.message = "1/2 - 1/2. Game ended with stalemate";
        status.statusCode = 1;
      } else if (chess.isThreefoldRepetition()) {
        status.message =
          "1/2 - 1/2. Game ended with draw because of threefold repetition";
        status.statusCode = 2;
      } else if (chess.isInsufficientMaterial()) {
        status.message =
          "1/2 - 1/2. Game ended with draw because of insufficient material";
        status.statusCode = 3;
      } else {
        status.message =
          "1/2 - 1/2. Game ended with draw because of 50 moves rule";
        status.statusCode = 4;
      }
    }
    status.message += "\nYou can start new game with /start";
  }

  const history = chess.history({ verbose: true });
  if (history.length > 0) {
    let move_number;
    if (history[0].color === "w") {
      move_number = Math.floor((history.length + 1) / 2);
    } else move_number = Math.floor((history.length + 2) / 2);

    status.lastMove = String(move_number) + ". ";
    if (chess.fen().includes("w")) {
      status.lastMove += "..." + history[history.length - 1].san;
    } else {
      status.lastMove += history[history.length - 1].san;
      status.turn = "black";
    }
  }

  return status;
}

module.exports.getPGN = getPGN;
module.exports.newGame = newGame;
module.exports.saveGame = saveGame;
module.exports.endGame = endGame;
module.exports.getGameStatus = getGameStatus;
