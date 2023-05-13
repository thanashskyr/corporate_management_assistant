const jwt = require("jsonwebtoken");
const pg = require("pg");
const format = require("pg-format");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "corpapp",
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

const storeToken = async (username, token) => {
  
  const sql = format(
    "INSERT INTO tokens (username, token) VALUES (%L, %L)",
    username,
    token
  );
  await pool.query(sql);
 
};

module.exports = {
  createToken,
  verifyToken,
  storeToken,
};
