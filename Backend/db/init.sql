-- Change the root user password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

-- Create a new database for your application
CREATE DATABASE IF NOT EXISTS employee_cafe;

-- Create the admin user only if it doesn't already exist
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin_password';

-- Grant privileges to the admin user for the database
GRANT ALL PRIVILEGES ON employee_cafe.* TO 'admin'@'%';

-- Ensure that privileges are flushed to take effect
FLUSH PRIVILEGES;

USE employee_cafe;

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(10) NOT NULL PRIMARY KEY, -- 'UIXXXXXXX' format, 10 characters
    name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) NOT NULL UNIQUE, -- Email address should be unique
    phone_number CHAR(8) NOT NULL, -- 8 digits phone number
    gender ENUM('Male', 'Female', 'Others') NOT NULL
);

-- Create the cafes table
CREATE TABLE IF NOT EXISTS cafes (
    id CHAR(36) NOT NULL PRIMARY KEY, -- UUID is 36 characters long
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    logo VARCHAR(255),
    location VARCHAR(255) NOT NULL
);

-- Create the employee_cafe table
CREATE TABLE IF NOT EXISTS employee_cafe (
    employee_id VARCHAR(10) NOT NULL,
    cafe_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    PRIMARY KEY (employee_id, cafe_id), -- Composite primary key
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (cafe_id) REFERENCES cafes(id)
);
