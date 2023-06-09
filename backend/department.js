const express = require("express");
const router = express.Router();
const auth = require("./auth");
const pool = require("./db");

// CREATE
router.post("/", auth.authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name){
    res.status(400).send("Bad request");
  }
  const exists = await pool.query(
    "SELECT * FROM department WHERE name = ($1)",
    [name]
  );
  if (exists.rows.length == 0) {
    try {
      const emp_result = await pool.query(
        "INSERT INTO department (name) VALUES ($1) RETURNING *",
        [name]
      );

      res.send("department added succesfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.status(409).send("department allready exists");
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
    const result = await pool.query(
      "SELECT * FROM employee AS e JOIN employee_department AS ed ON e.id = ed.employee_id WHERE ed.department_id =$1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).send("Department with this id not found");
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

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
