const { prompt } = require("inquirer");
const mysql = require("mysql2/promise");
let db;

init();

async function connect() {
  const database = "company_db";
  db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "",
      database: database,
    },
    console.log(`Connected to the ${database} database.`)
  );
}
async function init() {
  await connect();
  // show employees with ids, first names, last names, job titles, departments, salaries, and managers
  const [employees] = await db.execute(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM ( employees LEFT JOIN roles ON role_id = roles.id LEFT JOIN ( SELECT * FROM employees ) AS managers ON employees.manager_id = managers.id LEFT JOIN departments ON department_id = departments.id )"
  );
  // show departments with ids and names
  const [departments] = await db.execute(
    "SELECT departments.id, departments.name FROM departments"
  );
  // show roles with ids, titles, department, and salary
  const [roles] = await db.execute(
    "SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id"
  );
  console.table(employees);
  console.table(departments);
  console.table(roles);
}
