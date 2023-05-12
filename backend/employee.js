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

// CREATE AN EMPLOYEE
router.post("/", auth.authenticateToken, async (req, res) => {
  const { name, surname, uin_number, department_id } = req.body;

  const exists_name = await pool.query("SELECT * FROM employee WHERE name = ($1) AND surname = ($2)", [name, surname]);
  const exists_uin =  await pool.query("SELECT * FROM employee WHERE uin_number = ($1)", [uin_number]);
  if ((exists_name.rows.length == 0) && (exists_uin.rows.length == 0))
  {

      try {
        const emp_result = await pool.query(
          "INSERT INTO employee (name, surname, uin_number) VALUES ($1, $2, $3) RETURNING *",
          [name, surname, uin_number]
        );
        
        const new_emp_id = emp_result.rows[0].id;
        for (let i = 0; i<=department_id.length-1; i++){
            const empdep_result = await pool.query(
              "INSERT INTO employee_department (employee_id, department_id) VALUES ($1, $2);",
              [new_emp_id, department_id[i]]
            );
        }
        res.send("Employee added succesfully");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
  }else{
    res.send("employee already exists");
  }

});

// READ ALL EMPLOYEES
router.get("/", auth.authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// READ ONE EMPLOYEE BY NAME
router.get("/byName", auth.authenticateToken, async (req, res) => {
  const { name, surname} = req.query;

  try {
    const departments= await pool.query("SELECT d.name , d.id FROM department d JOIN employee_department ed ON d.id = ed.department_id JOIN employee e ON e.id = ed.employee_id WHERE e.name = $1 AND e.surname = $2 ", [ name , surname ]);
    const employee= await pool.query("SELECT * FROM employee WHERE name = $1 AND surname = $2 ", [ name , surname ]);
       
        if (employee.rows.length === 0) {
         
          res.status(404).send("Employee with this name or surname not found");
        }else{
          res.json({employee: employee.rows[0], working_on: departments.rows});
        }


  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//READ AN EMPLOYEE BY UIN_NUMBER
router.get("/byUin", auth.authenticateToken, async (req, res) => {
  const  {uin}  = req.query;

  try {
    const departments= await pool.query("SELECT d.name , d.id FROM department d JOIN employee_department ed ON d.id = ed.department_id JOIN employee e ON e.id = ed.employee_id WHERE e.uin_number = $1 ", [ uin ]);
    const employee= await pool.query("SELECT * FROM employee WHERE uin_number = $1", [ uin ]);
       
        if (employee.rows.length === 0) {
         
          res.status(404).send("Employee with this uin not found");
        }else{
          res.json({employee: employee.rows[0], working_on: departments.rows});
        }


  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE AN EMPLOYEE AND  HIS DEPARTMENTS 
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, surname, uin_number, department_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE employee SET name = $1, surname = $2, uin_number = $3 WHERE id = $4 RETURNING *",
      [name, surname, uin_number, id]
    );
    const del = await pool.query(
    "DELETE FROM employee_department WHERE employee_id = " + id);

    for (let i = 0; i<=department_id.length-1; i++){
        const empdep_result = await pool.query(
          "INSERT INTO employee_department (employee_id, department_id) VALUES ($1, $2);",
          [id, department_id[i]]
        );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Not such an employee or department");
  }
});

// DELETE AN EMPLOYEE
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
