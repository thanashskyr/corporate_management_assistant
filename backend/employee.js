const express = require("express");
const router = express.Router();
const auth = require("./auth");
const pool = require("./db");
// CREATE AN EMPLOYEE
router.post("/", auth.authenticateToken, async (req, res) => {
  const { name, sirname, vat, department_id } = req.body;
  if (!name || !sirname || !vat || !department_id) {
    return res.status(400).send("Bad Request");
  }
  const exists_name = await pool.query(
    "SELECT * FROM employee WHERE name = ($1) AND sirname = ($2)",
    [name, sirname]
  );
  const exists_vat = await pool.query(
    "SELECT * FROM employee WHERE vat = ($1)",
    [vat]
  );
  if (exists_name.rows.length == 0 && exists_vat.rows.length == 0) {
    try {
      const emp_result = await pool.query(
        "INSERT INTO employee (name, sirname, vat) VALUES ($1, $2, $3) RETURNING *",
        [name, sirname, vat]
      );

      const new_emp_id = emp_result.rows[0].id;
      for (let i = 0; i <= department_id.length - 1; i++) {
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
  } else {
    res.status(422).send("employee already exists");
  }
});

// READ ALL EMPLOYEES
router.get("/", auth.authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT e.id, e.name, e.sirname, e.vat, array_agg(d.name) AS departments
    FROM employee AS e
    JOIN employee_department AS ed ON e.id = ed.employee_id
    JOIN department AS d ON ed.department_id = d.id
    GROUP BY e.id, e.name
  `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// READ ONE EMPLOYEE BY NAME
router.get("/byName", auth.authenticateToken, async (req, res) => {
  const { name, sirname } = req.query;

  try {
    const departments = await pool.query(
      "SELECT d.name , d.id FROM department d JOIN employee_department ed ON d.id = ed.department_id JOIN employee e ON e.id = ed.employee_id WHERE e.name = $1 AND e.sirname = $2 ",
      [name, sirname]
    );
    const employee = await pool.query(
      "SELECT * FROM employee WHERE name = $1 AND sirname = $2 ",
      [name, sirname]
    );

    if (employee.rows.length === 0) {
      res.status(404).send("Employee with this name or sirname not found");
    } else {
      res.json({ employee: employee.rows[0], working_on: departments.rows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//READ AN EMPLOYEE BY VAT
router.get("/byVat", auth.authenticateToken, async (req, res) => {
  const { vat } = req.query;

  try {
    const departments = await pool.query(
      "SELECT d.name , d.id FROM department d JOIN employee_department ed ON d.id = ed.department_id JOIN employee e ON e.id = ed.employee_id WHERE vat = $1 ",
      [vat]
    );
    const employee = await pool.query("SELECT * FROM employee WHERE vat = $1", [
      vat,
    ]);

    if (employee.rows.length === 0) {
      res.status(404).send("Employee with this vat not found");
    } else {
      res.json({ employee: employee.rows[0], working_on: departments.rows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE AN EMPLOYEE AND  HIS DEPARTMENTS
router.put("/:id", auth.authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, sirname, vat, department_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE employee SET name = $1, sirname = $2, vat = $3 WHERE id = $4 RETURNING *",
      [name, sirname, vat, id]
    );
    const del = await pool.query(
      "DELETE FROM employee_department WHERE employee_id = " + id
    );

    for (let i = 0; i <= department_id.length - 1; i++) {
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
