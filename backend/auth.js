const pg = require("pg");
const jwt = require("./jwt");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "corpapp",
  password: "postgres",
  port: 5432,
});

const authenticateUser = async(username, password) => {
  try{
      
    const result = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2",[username, password])
      
        if (result.rows.length > 0) {
          isAuthenticated = true;
        } else {
          isAuthenticated = false;
        }
      
    return isAuthenticated;
      
  }catch(err){
        
        throw err;
  }    
};

// Middleware function to check if the user is authenticated
const authenticateToken = async (req, res, next) => {
  // Get the token from the headers
  const authHeader = req.headers["authorization"];
  // splitting the authHeader string at the space character,
  //and returning the second element of the resulting array
  //(which should be the JWT token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Search the DB for a TOKEN that has not expired
    const { rows } = await pool.query(
      "SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()",
      [token]
    );

    // If none found then user is Unauthorized
    if (rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token integrity
    const payload = jwt.verifyToken(token, (err, username) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error");
      }
      // Return to the following function the username as data and continue
      req.user = username;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  authenticateUser,
  authenticateToken,
};
