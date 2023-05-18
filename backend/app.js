const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

  app.use(cors());

app.use(bodyParser.json());

const loginRouter = require("./login");
const employeeRouter = require("./employee");
const departmentRouter = require("./department");
const logoutRouter = require("./logout");


app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/emp", employeeRouter);
app.use("/dep", departmentRouter);

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
