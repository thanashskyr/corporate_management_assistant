const express = require("express");
const router = express.Router();
const auth = require("./auth");
const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "CorpApplication",
  password: "postgres",
  port: 5432,
});

// CREATE
router.post("/", auth.authenticateToken, async (req, res) => {
  const { name, surname, uin_number, department_id } = req.body;

  const exists = await pool.query("SELECT * FROM employee WHERE name = ($1) AND surname = ($2)", [name, surname]);
  if (exists.rows.length == 0 )
  {

      try {
        const emp_result = await pool.query(
          "INSERT INTO employee (name, surname, uin_number, department_id) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, surname, uin_number, department_id]
        );
        const new_emp_id = emp_result.rows[0].id;
        const empdep_result = await pool.query(
          "INSERT INTO employee_department (employee_id, department_id) VALUES ($1, $2);",
          [new_emp_id, department_id]
        );
        res.send("Employee added succesfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
  }else{
    res.send("employee already exists");
  }

});

// READ ALL USERS
router.get("/", auth.authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// READ ONE USER
router.get("/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM employee WHERE id =  " + id);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, surname, uin_number, department_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE employee SET name = $1, surname = $2, uin_number = $3, department_id= $4 WHERE id = $5 RETURNING *",
      [name, surname, uin_number, department_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE
router.delete("/:id", auth.authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      "DELETE FROM employee_department WHERE employee_id = " + id
    );
    const result = await pool.query("DELETE FROM employee WHERE id = " + id);
    if (result.rowCount === 0) {
      res.send("No User with id: " + id);
    } else {
      res.send("User Deleted");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
