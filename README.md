# Café Employee Manager

## Overview

The Café Employee Manager application is a full-stack web application designed to manage café and employee data. It allows users to perform various operations including creating, reading, updating, and deleting cafés and employees. The application is built with React JS (Frontend), Node.js (Backend) and MySQL (Database).

## Features

-   **Café Management**

    -   View a list of cafés with details including name, description, logo, location, and number of employees.
    -   Filter cafés by location.
    -   Add, edit, and delete café records.
    -   View and manage employees associated with each café.

-   **Employee Management**

    -   View a list of employees with details including ID, name, email, phone number, days worked, and assigned café.
    -   Add, edit, and delete employee records.
    -   Filter employees by café.

-   **API Endpoints**
    -   `GET /cafes?location=<location>`: Retrieve cafés filtered by location.
    -   `GET /employees?cafe=<café>`: Retrieve employees sorted by the number of days worked.
    -   `POST /cafe`: Create a new café.
    -   `POST /employee`: Create a new employee and associate them with a café.
    -   `PUT /cafe`: Update an existing café.
    -   `PUT /employee`: Update an existing employee and their café association.
    -   `DELETE /cafe`: Delete a café and its associated employees.
    -   `DELETE /employee`: Delete an employee.

## Technology Stack

-   **Frontend**:

    -   React JS
    -   Tanstack Router for view management (Will be implemented later, not able to resolve for now, using react-router-dom)
    -   Tanstack Query for state management and data fetching
    -   Aggrid for table components
    -   Material-UI for styling

-   **Backend**:
    -   Node.js
    -   MySQL for database management

## Setup

1. **Database Setup (MySQL)**

    - Install MySQL and set up the server.
    - Run the following SQL commands to create and configure the database:

        ```sql
        CREATE DATABASE cafe_employee_manager;

        USE cafe_employee_manager;

        CREATE TABLE employees (
            id VARCHAR(10) NOT NULL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email_address VARCHAR(255) NOT NULL UNIQUE,
            phone_number CHAR(8) NOT NULL,
            gender ENUM('Male', 'Female', 'Others') NOT NULL
        );

        CREATE TABLE cafes (
            id CHAR(36) NOT NULL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            logo VARCHAR(255),
            location VARCHAR(255) NOT NULL
        );

        CREATE TABLE employee_cafe (
            employee_id VARCHAR(10) NOT NULL,
            cafe_id CHAR(36) NOT NULL,
            start_date DATE NOT NULL,
            PRIMARY KEY (employee_id, cafe_id),
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (cafe_id) REFERENCES cafes(id)
        );
        ```

2. **Backend Setup**

    - Change Directory to Backend and run 'npm install'
    - Create a .env file with add details such as DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, PORT
    - Run 'npm run seed' to generate seed/sample dataset in MySQL database.
    - Start the backend server by executing 'nodemon app.js'
    - Verify by checking localhost:3000 (To be changed accordingly if hosted on cloud)

3. **Frontend Setup**

    - Change Directory to Frontend and run 'npm install'
    - Start the frontend server by executing 'npm run dev'
    - Implement the frontend functionality as specified, using React and the selected libraries.
    - Verify by checking localhost:5173 (To be changed accordingly if hosted on cloud)

4. **Dockerization**
    For Backend, create Dockerfile
       ```sql
        # Backend/Dockerfile

        # Use the official Node.js image
        FROM node:18

        # Set the working directory
        WORKDIR /app

        # Copy package.json and install dependencies
        COPY package*.json ./
        RUN npm install

        # Copy the rest of the application files
        COPY . .

        # Expose port 3000
        EXPOSE 3000

        # Run the seed command to initialize the database (only once)
        CMD ["sh", "-c", "npm run seed && npm run dev"]


       ```
   
   and also in Backend, create init .sql:
   
       ```sql
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

       ```

   and in Frontend, create Dockerfile
       ```
        # Frontend/Dockerfile

        # Use the official Node.js image
        FROM node:18

        # Set working directory inside the container
        WORKDIR /app

        # Copy package.json and package-lock.json (if present)
        COPY package*.json ./

        # Install dependencies
        RUN npm install

        # Copy the rest of the application files
        COPY . .

        # Expose port 8080
        EXPOSE 8080

        # Run the Vite development server
        CMD ["npm", "run", "dev"]

       ```

   Lastly, outside Backend and Frontend (the main project folder), we create docker-compose.yml (Currently not working, trying to resolve it when I can)
      ```sql
      
        services:
          mysql:
            image: mysql:8.0.36
            container_name: mysql_db
            restart: always
            environment:
              MYSQL_ROOT_PASSWORD: password
              MYSQL_DATABASE: employee_cafe
              MYSQL_USER: admin
              MYSQL_PASSWORD: password
            ports:
              - "3307:3306"
            volumes:
              - ./Backend/db/init.sql:/docker-entrypoint-initdb.d/init.sql
            networks:
              - backend-network
            healthcheck:
              test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
              interval: 10s
              timeout: 5s
              retries: 3

          backend:
            build: ./Backend
            container_name: node_backend
            environment:
              DB_USER: admin
              DB_PASSWORD: password
              DB_HOST: mysql
              DB_PORT: 3306
              DB_NAME: employee_cafe
              PORT: 3000
              FRONTENDURL: http://localhost:8080
            ports:
              - "3000:3000"
            depends_on:
              mysql:
                condition: service_healthy
            networks:
              - backend-network

          frontend:
            build: ./Frontend
            container_name: react_frontend
            ports:
              - "8080:8080"
            environment:
              VITE_API_URL: "http://localhost:3000"
            depends_on:
              - backend
            networks:
              - backend-network

        networks:
          backend-network:
            driver: bridge


   ```
Once set up, we are ready to run the app!
Explore http://localhost:8080/cafes or http://localhost:8080/employees to start.

Improvements to be done: 
- Split the Pages further into Components without Prop Drilling (Once I am more familiar with Tanstack Query)
