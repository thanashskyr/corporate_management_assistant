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
  const { name }  = req.body;

  const exists = await pool.query("SELECT * FROM department WHERE name = ($1)", [name]);
  if (exists.rows.length == 0 )
  {


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


  }else{
    res.send("department allready exists");
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
    const result = await pool.query("SELECT * FROM department WHERE id = " + id);
    const join_result= await pool.query("SELECT employee_id FROM employee_department WHERE department_id = " + id);

      if (result.rows.length === 0) {
          
        res.status(404).send("Department with this id not found");
      }else{
        res.json({derpartment: result.rows[0], employees_on_department: join_result.rows});
      }
   
       
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE 
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, } = req.body;

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
