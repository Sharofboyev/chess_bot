const { Pool } = require("pg");
const config = require("../config");
const pool = new Pool(config.db);

async function getGame(userId) {
  try {
    const res = await pool.query(
      "SELECT * FROM games WHERE user_id = $1 AND is_active",
      [userId]
    );
    return res.rows[0].pgn;
  } catch (err) {
    console.log(
      "Error occured in models/getGame. Error message: ",
      err.message
    );
    return null;
  }
}

async function newGame(userId) {
  try {
    await pool.query("INSERT INTO games (user_id) VALUES($1)", [userId]);
  } catch (err) {
    console.log(
      "Error occured in models/getGame. Error message: ",
      err.message
    );
  }
}

module.exports.getPGN = getGame;
module.exports.newGame = newGame;
