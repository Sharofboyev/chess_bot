const { Pool } = require("pg");
const config = require("../config");
const pool = new Pool(config.db);
pool.query(
  `CREATE TABLE IF NOT EXISTS users 
  (id BIGINT PRIMARY KEY, name VARCHAR NOT NULL, created_time TIMESTAMPTZ DEFAULT NOW())`
).catch((err) => {
  console.log("Can't create table of users! Error message: ", err.message);
})

pool.query(
  `CREATE TABLE IF NOT EXISTS games 
  (id SERIAL PRIMARY KEY, pgn VARCHAR NOT NULL DEFAULT '', is_active BOOLEAN DEFAULT TRUE, user_id BIGINT NOT NULL, 
    created_time TIMESTAMPTZ DEFAULT NOW())`
).catch((err) => {
  console.log("Can't create table of games! Error message: ", err.message);
})

async function getGame(userId) {
  try {
    const res = await pool.query(
      "SELECT * FROM games WHERE user_id = $1 AND is_active",
      [userId]
    );
    if (res.rowCount > 0) return res.rows[0].pgn;
    else return null;
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
      "Error occured in models/newGame. Error message: ",
      err.message
    );
  }
}

async function saveGame(userId, pgn) {
  try {
    await pool.query(
      "UPDATE games SET pgn = $1 WHERE user_id = $2 AND is_active",
      [pgn, userId]
    );
  } catch (err) {
    console.log(
      "Error occured in models/saveGame. Error message: ",
      err.message
    );
  }
}

async function endGame(userId, pgn) {
  try {
    await pool.query(
      "UPDATE games SET is_active = FALSE, pgn = COALESCE($2, pgn) WHERE user_id = $1 AND is_active",
      [userId, pgn]
    );
  } catch (err) {
    console.log(
      "Error occured in models/endGame. Error message: ",
      err.message
    );
  }
}

module.exports.getPGN = getGame;
module.exports.newGame = newGame;
module.exports.saveGame = saveGame;
module.exports.endGame = endGame;
