const express = require("express");
//const jwt = require("./jwt");
const auth = require("./auth");
const router = express.Router();
const pool = require("./db");

router.post("/", auth.authenticateToken, async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token=authHeader && authHeader.split(" ")[1]
    
try {
   await pool.query("DELETE FROM tokens WHERE token = $1", [token]);
     res.send("Logout successful!");      
} catch (err){
    console.error(err);
    res.status(500).send('Server error');
}


  });

module.exports = router;