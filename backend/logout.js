const express = require("express");
const auth = require("./auth");
const router = express.Router();
const pool = require("./db");

router.post("/", auth.authenticateToken, async (req, res) => {
    const username = req.user;
    const authHeader = req.headers["authorization"];
    const token=authHeader && authHeader.split(" ")[1]
    console.log(username);
    
try {
   await pool.query("DELETE FROM tokens WHERE token = $1 AND username = $2", [token, username]);
     res.status(200).send("Logout successful!");      
} catch (err){
    console.error(err);
    res.status(500).send('Server error');
}


  });

module.exports = router;