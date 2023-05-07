Database: CorpApplication

DROP DATABASE IF EXISTS "CorpApplication";

CREATE DATABASE "CorpApplication"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
CREATE TABLE USERS (
  NAME VARCHAR(255),
  SIRNAME VARCHAR(255),
  UIN VARCHAR(255),
  USERNAME VARCHAR(255),
  PASSWORD VARCHAR(255)
);

DROP TABLE tokens;


CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

INSERT INTO USERS (NAME, SIRNAME, UIN, USERNAME, PASSWORD)
VALUES 
  ('Thita', 'Kapa', '00000000', 'thita', 'passkapa'),
  ('Alpha', 'Vita', '11111111', 'alpha', 'passvita'),
  ('Gama', 'Delta', '22222222', 'gama', 'passdelta'),
  ('Ypsilon', 'Zhta', '33333333', 'ypsilon', 'passzhta'),
  ('Htta', 'Thita', '44444444', 'htta', 'passthita');


SELECT * FROM TOKENS;


-- Departments and Employees

DROP TABLE Department CASCADE;
DROP TABLE Employee CASCADE;
DROP TABLE Employee_Department CASCADE;



CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  uin_number VARCHAR(255) NOT NULL,
  department_id INTEGER REFERENCES department(id)
);

CREATE TABLE employee_department (
  employee_id INTEGER REFERENCES employee(id),
  department_id INTEGER REFERENCES department(id),
  PRIMARY KEY (employee_id, department_id)
);

INSERT INTO department (name) VALUES ('IT');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('HR');

INSERT INTO employee (name, surname, uin_number, department_id) 
VALUES ('John', 'Doe', '12345', 1);

INSERT INTO employee (name, surname, uin_number, department_id) 
VALUES ('Jane', 'Doe', '67890', 2);

INSERT INTO employee (name, surname, uin_number, department_id) 
VALUES ('Bob', 'Smith', '24680', 3);

INSERT INTO employee_department (employee_id, department_id) VALUES (1, 1);
INSERT INTO employee_department (employee_id, department_id) VALUES (2, 2);
INSERT INTO employee_department (employee_id, department_id) VALUES (2, 1);
INSERT INTO employee_department (employee_id, department_id) VALUES (3, 3);



select * from employee;
select * from department;
select * from employee_department;

SELECT e.name, e.surname, e.uin_number
FROM employee e
JOIN employee_department de ON e.id = de.employee_id
JOIN department d ON de.department_id = d.id
WHERE d.name = 'IT';