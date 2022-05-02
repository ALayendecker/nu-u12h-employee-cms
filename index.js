const { prompt } = require("inquirer");
const mysql = require("mysql2/promise");
let db;

async function connect() {
  const database = "company_db";
  db = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "",
      database: database,
    }
    // console.log(`Connected to the ${database} database.`)
  );
}

const getEmployees = async () => {
  // show employees with ids, first names, last names, job titles, departments, salaries, and managers
  const [employees] = await db.execute(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM ( employees LEFT JOIN roles ON role_id = roles.id LEFT JOIN ( SELECT * FROM employees ) AS managers ON employees.manager_id = managers.id LEFT JOIN departments ON department_id = departments.id )"
  );
  return employees;
};
const getRoles = async () => {
  // show roles with ids, titles, department, and salary
  const [roles] = await db.execute(
    "SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id"
  );
  return roles;
};
const getDepartments = async () => {
  // show departments with ids and names
  const [departments] = await db.execute(
    "SELECT departments.id, departments.name FROM departments"
  );
  return departments;
};
async function cms() {
  await connect();
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add employee",
        "Update employee role",
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Quit",
      ],
    },
  ]);
  // choose action based on choice
  if (choice === "View all employees") {
    console.table(await getEmployees());
    cms();
  } else if (choice === "Add employee") {
    cms();
  } else if (choice === "Update employee role") {
    cms();
  } else if (choice === "View all roles") {
    console.table(await getRoles());
    cms();
  } else if (choice === "Add role") {
    cms();
  } else if (choice === "View all departments") {
    console.table(await getDepartments());
    cms();
  } else if (choice === "Add department") {
    cms();
  } else if (choice === "Quit") {
    console.log("Goodbye!");
    process.exit();
  } else {
    console.error(`error: ${choice}`);
    process.exit();
  }
}

cms();
