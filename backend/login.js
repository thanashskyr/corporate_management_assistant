const express = require("express");
const jwt = require("./jwt");
const auth = require("./auth");
const router = express.Router();

router.post("/", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  auth.authenticateUser(username, password, function (err, isAuthenticated) {
    if (err) {
      console.log(err);
      res.send("An error occurred");
    } else {
      if (isAuthenticated) {
        const token = jwt.createToken(username);
        jwt.storeToken(username, token, function (err, isStored) {
          if (err) {
            console.log(err);
            res.send("An error occurred");
          } else {
            res.cookie("token", token, { maxAge: 86400000 });
            res.send("Login successful!");
          }
        });
      } else {
        res.send("Invalid username or password");
      }
    }
  });
});

module.exports = router;
