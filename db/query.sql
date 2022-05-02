SELECT * FROM departments;
SELECT * FROM employees;
SELECT * FROM roles;
SELECT employees.id,
  employees.first_name,
  employees.last_name,
  roles.title,
  departments.name AS department,
  roles.salary,
  CONCAT_WS(' ', managers.first_name, managers.last_name) AS manager
FROM (
    employees
    LEFT JOIN roles ON role_id = roles.id
    LEFT JOIN (
      SELECT *
      FROM employees
    ) AS managers ON employees.manager_id = managers.id
    LEFT JOIN departments ON department_id = departments.id
  );