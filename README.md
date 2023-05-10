## **Corporate Application - Scrum - ToDo list**


**Tasks for Today 09/05**
  - Change the DB
    - remove department_id field from employee
    - READ ONE EMPLOYEE must contains all the departments employee works
    - READ ONE DEPARTMENT must contains all the employees working in it 

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
