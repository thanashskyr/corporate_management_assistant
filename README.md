## **Corporate Application - Scrum - ToDo list**
**Tasks for 12/05**
  - story100
    - issue#12 fixed
      - Use JOIN query at ADD ONE DEPARTMENT
      - Use JOIN query at READ ONE EMPLOYEE BY NAME
      - Use JOIN query at READ ONE EMPLOYEE BY UIN
    - issue #10 fixed avoid callback hell
      - Removed callback function from auth.authenticateUser function and use of async-await
      - Removed callback function from jwt.storeToken function and use of async-await   
      - Use of async-await at login.js
    - issue #9 fixed lowercase naming in db artifacts  
**Tasks for 09-011/05**
  - Complete the department and employee CRUD
    - remove department_id field from employee
    - READ ONE EMPLOYEE must contains all the departments employee works
    - READ ONE EMPLOYEE BY NAME and READ ONE EMPLOYEE BY UIN_NUMBER features added
    - check if an employee with the same name and surname or uin number exists before adding a new employee
    - READ ONE DEPARTMENT must contains all the employees working on it 
    - added error messages from invalid inputs
    - removed commented code from department.js

**Tasks for Today 09/05**

  - Story 60: In the same file create a router /:id/emp that will return all the employees per department
    - e.g. /department/1/emp
  - Story 70: Department Validation
    - No Departments with same name
  - Story 80: Emp Validation


**Tasks for Today 08/05**

- Story 50: Create Department CRUD
  - Create Department
  - Read Department one/all
  - Update Department
  - Delete Department
  - Add the authorizeToken middleware to the Department CRUD


**Bugs**

- Bug 10: Changed regular functions to arrow functions
- Bug 20: Code Refactoring - SQL Query refactoring

**Tasks for Today 07/05**

- Story 10: Complete the user /login API using POSTMAN
  - JWT Token implementation
  - Postgres integration
- Task: Design the Database
  - Employees
  - Departments
  - Relation between them
- Story 20: Create all the appropriate SQL scripts for Emp and Dep Tables
- Task: Design the Employee and the Department CRUD APIs
- Story 30: Create the Employee CRUD API
- Story 40: Make sure the user is authenticated to do a specific action

**Tasks for Today 05/05**

- Create a User Friendly UI on Paper to Visualize easier.
- Write a simple Express Server and set up Postman.
  - Create all the USER API and functionality
  - Add manually 3 USERS in the DB using SQL script
  - that will be included in BE folder later
- Create Login Router
  - Use JWT Token to Authenticate the USER on login.
  - Save the Token in the DB
  - Make sure that for every USER functionality the token is USED to Authenticate

**Tasks for Today - 04/05**

- Familiarize with React.js
  - watch a small YT about it and then start practicing on a very first component.
- Familiarize and setup PostgresQL - consider using a container DB.
  - How to install and setup PostgresQL in Windows
  - How to install Docker in Windows
- Create a github repo with the following structure:
  - /backend
  - /frontend
  - /README.md
- Start a conversation with ChatGPT https://chat.openai.com/ about the project.
