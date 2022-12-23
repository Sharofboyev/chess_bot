require("dotenv").config();

module.exports = {
  engine: process.env.ENGINE,
  fen2img: process.env.FEN2IMG,
  token: process.env.BOT_TOKEN,
};
