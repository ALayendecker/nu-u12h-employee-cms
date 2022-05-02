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

  const [company] = await db.execute("SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT_WS(' ', managers.first_name, managers.last_name) AS manager FROM ( employees LEFT JOIN roles ON role_id = roles.id LEFT JOIN ( SELECT * FROM employees ) AS managers ON employees.manager_id = managers.id LEFT JOIN departments ON department_id = departments.id )");
  console.table(company);
}
