const { Stockfish } = require("./services/stockfish");
const { Chess } = require("chess.js");
const { Telegraf } = require("telegraf");
const config = require("./config");
const bot = new Telegraf(config.token);
const stockfishService = new Stockfish();
const chess = new Chess();
const { getPGN, newGame } = require("./services/games");

bot.start(async (ctx) => {
  const pgn = await getPGN(ctx.from.id);
  if (!pgn) {
    await newGame(ctx.from.id);
  }
  chess.loadPgn("");
  const path = await stockfishService.generateImageLink(chess.fen());
  ctx.replyWithPhoto(path);
});

bot.on("text", async (ctx) => {
  chess.load(position);
  stockfishService.getBestMove(position, 1).then(async (bestMove) => {
    console.log(bestMove);
    try {
      chess.move(bestMove);
      const path = await stockfishService.generateImageLink(chess.fen());
      ctx.replyWithPhoto(path);
    } catch (err) {
      console.log(err.message);
      return ctx.reply("Error occured");
    }
  });
});

bot.launch();
