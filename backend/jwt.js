const jwt = require("jsonwebtoken");
const pg = require("pg");
const format = require("pg-format");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "CorpApplication",
  password: "postgres",
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

const createToken = (username) => {
  const payload = {
    username: username,
  };
  const secret = process.env.JWT_SECRET;
  console.log(secret);
  const options = {
    expiresIn: "24h",
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token, callback) => {
  const secret = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    callback(null, decoded.username);
  } catch (err) {
    console.error(err);
    callback(err, null);
  }
};

const storeToken = (username, token, callback) => {
  const sql = format(
    "INSERT INTO tokens (username, token) VALUES (%L, %L)",
    username,
    token
  );
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, true);
    }
  });
};

module.exports = {
  createToken,
  verifyToken,
  storeToken,
};
