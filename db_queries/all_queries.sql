Database: CorpApplication

-- SQL queries to DROP all DB tables needed so far

DROP DATABASE IF EXISTS "CorpApplication";
DROP TABLE tokens;
DROP TABLE department CASCADE;
DROP TABLE employee CASCADE;
DROP TABLE employee_department CASCADE;

-- SQL queries to CREATE all DB tables needed so far

CREATE DATABASE "CorpApplication"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
CREATE TABLE users (
  name VARCHAR(255),
  sirname VARCHAR(255),
  vat VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255)
);


CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sirname VARCHAR(255) NOT NULL,
  vat VARCHAR(255) NOT NULL
);

CREATE TABLE employee_department (
  employee_id INTEGER REFERENCES employee(id),
  department_id INTEGER REFERENCES department(id),
  PRIMARY KEY (employee_id, department_id)
);

-- Following INSERT used to manually inject USERS 

INSERT INTO users (name, sirname, vat, username, password)
VALUES 
  ('Thita', 'Kapa', '00000000', 'thita', 'passkapa'),
  ('Alpha', 'Vita', '11111111', 'alpha', 'passvita'),
  ('Gama', 'Delta', '22222222', 'gama', 'passdelta'),
  ('Ypsilon', 'Zhta', '33333333', 'ypsilon', 'passzhta'),
  ('Htta', 'Thita', '44444444', 'htta', 'passthita');





-- Testing: SQL Queries to INSERT to Tables
INSERT INTO department (name) VALUES ('IT');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('HR');

INSERT INTO employee (name, surname, vat) 
VALUES ('John', 'Doe', '12345');

INSERT INTO employee (name, surname, vat) 
VALUES ('Jane', 'Doe', '67890');

INSERT INTO employee (name, surname, vat) 
VALUES ('Bob', 'Smith', '24680');

INSERT INTO employee_department (employee_id, department_id) VALUES (1, 1);
INSERT INTO employee_department (employee_id, department_id) VALUES (2, 2);
INSERT INTO employee_department (employee_id, department_id) VALUES (2, 1);
INSERT INTO employee_department (employee_id, department_id) VALUES (3, 3);

-- Testing: SQL Queries to SELECT to Tables
SELECT * FROM tokens;
select * from employee;
select * from department;
select * from employee_department;

-- Select all employees that work in a department 
SELECT e.name, e.sirname, e.vat
FROM employee e
JOIN employee_department de ON e.id = de.employee_id
JOIN department d ON de.department_id = d.id
WHERE d.id = 4;


-- Select all departments that an employee works
SELECT d.name , d.id 
FROM department d 
JOIN employee_department ed ON d.id = ed.department_id 
JOIN employee e ON e.id = ed.employee_id 
WHERE e.name = 'Bob' AND e.sirname = 'Smith';