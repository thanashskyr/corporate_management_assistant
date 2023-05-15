const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "corpapp",
  password: "postgres",
  port: 5432,
});

module.exports = pool;