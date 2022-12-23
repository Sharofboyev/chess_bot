const { Stockfish } = require("./services/stockfish");
const { Chess } = require("chess.js");
const { Telegraf } = require("telegraf");
const config = require("./config");
const bot = new Telegraf(config.token);

const stockfishService = new Stockfish();
const position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const chess = new Chess();

bot.start(async (ctx) => {
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
