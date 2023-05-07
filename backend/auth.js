const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "CorpApplication",
  password: "linux",
  port: 5432,
});

function authenticateUser(username, password, callback) {
  pool.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password],
    function (err, result) {
      console.log(result);
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        if (result.rows.length > 0) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    }
  );
}

module.exports = {
  authenticateUser,
};
