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
    await addEmployee();
    cms();
  } else if (choice === "Update employee role") {
    cms();
  } else if (choice === "View all roles") {
    console.table(await getRoles());
    cms();
  } else if (choice === "Add role") {
    await addRole();
    cms();
  } else if (choice === "View all departments") {
    console.table(await getDepartments());
    cms();
  } else if (choice === "Add department") {
    await addDepartment();
    cms();
  } else if (choice === "Quit") {
    console.log("Goodbye!");
    process.exit();
  } else {
    console.error(`error: ${choice}`);
    process.exit();
  }
}

async function addDepartment() {
  const { departmentName } = await prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department?",
    },
  ]);
  // set query and args and then insert into database
  let query = "INSERT INTO departments (name) VALUES (?)";
  let args = [departmentName];
  await db.query(query, args);
  console.log(`Added ${departmentName} to the departments.`);
}

async function addRole() {
  const newRole = await prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "departmentId",
      message: "Which department does the role belong to?",
  // load departments dynamically and list, storing department.id as the chosen value
  choices: (
        await getDepartments()
      ).map((department) => ({
        name: department.name,
        value: department.id,
      })),
    },
  ]);
  // set query and args and then insert into database
  const { title, salary, departmentId } = newRole;
  let query =
    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
  let args = [title, salary, departmentId];
  await db.query(query, args);
  console.log(`Added ${title} to the roles.`);
}

async function addEmployee() {
  // map an array for managers so we can add a "None" with null
  let potentialManagers = (await getEmployees()).map((employee) => ({
    name: employee.first_name + " " + employee.last_name,
    value: employee.id,
  }));
  potentialManagers.unshift({ name: "None", value: null });

  const newEmployee = await prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
  // load roles dynamically and list, storing role.id as the chosen value
  choices: (
        await getRoles()
      ).map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "managerId",
      message: "Who is the employee's manager?",
      choices: potentialManagers,
    },
  ]);
  // set query and args and then insert into database
  const { firstName, lastName, roleId, managerId } = newEmployee;
  let query =
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  let args = [firstName, lastName, roleId, managerId];
  await db.query(query, args);
  console.log(`Added ${firstName} ${lastName} to the employees.`);
}
cms();
