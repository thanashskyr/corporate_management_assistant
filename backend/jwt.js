const jwt = require("jsonwebtoken");
const pg = require("pg");
const format = require("pg-format");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "CorpApplication",
  password: "linux",
  port: 5432,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });

function createToken(username) {
  const payload = {
    username: username,
  };
  const secret = "your_secret_key";
  const options = {
    expiresIn: "24h",
  };
  return jwt.sign(payload, secret, options);
}

function verifyToken(token, callback) {
  const secret = "your_secret_key";
  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, decoded.username);
    }
  });
}

function storeToken(username, token, callback) {
  const sql = format(
    "INSERT INTO tokens (username, token) VALUES (%L, %L)",
    username,
    token
  );
  pool.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, true);
    }
  });
}

module.exports = {
  createToken,
  verifyToken,
  storeToken,
};
