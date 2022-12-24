require("dotenv").config();

module.exports = {
  engine: process.env.ENGINE,
  fen2img: process.env.FEN2IMG,
  token: process.env.BOT_TOKEN,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
