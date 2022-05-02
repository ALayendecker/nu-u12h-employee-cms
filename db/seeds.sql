INSERT INTO departments (name)
VALUES ("Development"),
  ("Engineering"),
  ("IT"),
  ("Finance"),
  ("Legal"),
  ("Project Management"),
  ("Sales"),
  ("Training");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 150000.00, 7),
  ("Salesperson", 125000.00, 7),
  ("Engineering Lead", 120000.00, 2),
  ("Telecom Engineer", 110000.00, 2),
  ("Development Lead", 120000.00, 1),
  ("Developer", 110000.00, 1),
  ("Project Management Lead", 120000.00, 6),
  ("Project Manager", 110000.00, 6),
  ("Accountant", 70000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Will", "Taylor", 5, NULL),
  ("Steven", "Knoblock", 7, NULL);

-- insert managers above and then basic employees below to prevent constraint errors
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("William", "Hoffman", 6, 1),
  ("Eric", "Barr", 8, 2);