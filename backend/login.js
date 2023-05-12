const express = require("express");
const jwt = require("./jwt");
const auth = require("./auth");
const router = express.Router();

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //let isAuthenticated= false;
 
try {
    await auth.authenticateUser(username, password);
      
      if (isAuthenticated) {
        const token = jwt.createToken(username);
        console.log(token);
            
            try{
                await jwt.storeToken(username, token) 
            }catch(err){
                res.send("error saving token");
            }

            res.cookie("token", token, { maxAge: 86400000 });
            res.send("Login successful!");
        }else {
        res.send("Invalid username or password");
      }
    
} catch (err){
  console.error(err);
  res.status(500).send('Server error');
}


  });

module.exports = router;
