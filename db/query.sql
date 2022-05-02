SELECT * FROM departments;
SELECT * FROM employees;
SELECT * FROM roles;
SELECT employees.id,
  employees.first_name,
  employees.last_name,
  roles.title,
  departments.name AS department,
  roles.salary,
  CONCAT_WS(' ', manager.first_name, manager.last_name) AS manager
FROM (
    employees
    LEFT JOIN roles ON role_id = roles.id
    LEFT JOIN (
      SELECT *
      FROM employees
    ) AS manager ON manager.id = employees.manager_id
    LEFT JOIN departments ON department_id = departments.id
  );