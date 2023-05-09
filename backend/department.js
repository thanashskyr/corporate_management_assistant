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
  const { name } = req.body;
  try {
    const emp_result = await pool.query(
      "INSERT INTO department (name) VALUES ($1) RETURNING *",
      [name]
    );
    const new_dep_id = emp_result.rows[0].id;
    // const empdep_result = await pool.query(
    //   "INSERT INTO employee_department (employee_id, department_id) VALUES ($1, $2);",
    //   [new_emp_id, department_id]
    // );
    res.send("department added succesfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// READ ALL DEPARTMENTS
router.get("/", auth.authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM department");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// READ ONE DEPARTMENT
router.get("/:id/emp", auth.authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM employee WHERE department_id = " + id);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE ???? needs to be able to change the employees that work an a specific department 
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, surname, uin_number, department_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE department SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
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
      "DELETE FROM employee_department WHERE department_id = " + id
    );
    const result = await pool.query("DELETE FROM department WHERE id = " + id);
    if (result.rowCount === 0) {
      res.send("No department with id: " + id);
    } else {
      res.send("Department Deleted");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
