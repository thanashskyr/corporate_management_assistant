const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const loginRouter = require("./login");

app.use("/login", loginRouter);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
