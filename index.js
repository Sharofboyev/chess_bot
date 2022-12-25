const { Stockfish } = require("./services/stockfish");
const { Chess } = require("chess.js");
const { Telegraf } = require("telegraf");
const config = require("./config");
const bot = new Telegraf(config.token);
const stockfishService = new Stockfish();
const chess = new Chess();
const {
  getPGN,
  newGame,
  saveGame,
  endGame,
  getGameStatus,
} = require("./services/games");

bot.start(async (ctx) => {
  let pgn = await getPGN(ctx.from.id);
  if (pgn === null) {
    await newGame(ctx.from.id);
    pgn = "";
  }
  chess.loadPgn(pgn);
  const path = await stockfishService.generateImageLink(chess.fen());
  ctx.replyWithPhoto(
    path,
    {
      caption:
        "Your move. Move can be one of two formats: Nf3 (piece and destination point) or c1f3 (source and destination point)",
    },
    { reply_markup: { keyboard: [[{ text: "Flip board" }]] } }
  );
});

bot.hears("Flip board", (ctx) => {
  ctx.reply("This feature is not ready yet");
});

bot.hears("endGame", async (ctx) => {
  await endGame(ctx.from.id);
  ctx.reply("Game successfully ended");
});

bot.on("text", async (ctx) => {
  const pgn = await getPGN(ctx.from.id);
  if (pgn === null) return ctx.reply("You should start new game by /start");
  chess.loadPgn(pgn);

  //Validation of move
  const oldPosition = chess.fen();
  const move = ctx.message.text;
  chess.move(move);
  let newPosition = chess.fen();
  if (oldPosition === newPosition) {
    if (move.length === 4) {
      chess.move({ from: move.substring(0, 2), to: move.substring(2) });
      newPosition = chess.fen();
    }
  }
  if (oldPosition === newPosition) return ctx.reply("Invalid move notation");

  //Check if user ended the game
  const status = getGameStatus(chess.pgn());
  if (status.isEnded) {
    await endGame(ctx.from.id, chess.pgn());
    const link = await stockfishService.generateImageLink(chess.fen());
    return ctx.replyWithPhoto(link, {
      caption: status.lastMove + "\n" + status.message,
    });
  }

  //Get next move from engine
  stockfishService.getBestMove(newPosition, 4).then(async (bestMove) => {
    try {
      chess.move(bestMove);
      saveGame(ctx.from.id, chess.pgn());

      //Check if engine ended the game
      const status = getGameStatus(chess.pgn());
      if (status.isEnded) {
        await endGame(ctx.from.id, chess.pgn());
        const link = await stockfishService.generateImageLink(chess.fen());
        ctx.replyWithPhoto(link, {
          caption: status.lastMove + "\n" + status.message,
        });
      }
      const link = await stockfishService.generateImageLink(chess.fen());
      ctx.replyWithPhoto(link, { caption: status.lastMove + "\nYour turn" });
    } catch (err) {
      console.log(err.message);
      return ctx.reply("Error occured");
    }
  });
});

bot.catch((err, ctx) => {
  console.log(err);
  ctx.reply("Error occured. Please, contact to the developer: @cpphacker");
});

bot.launch();
