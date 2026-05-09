# Educase School Management API

A robust Node.js, Express, and TypeScript API for managing school data, including functionalities to add, list, update, and delete school records. It leverages MySQL for database management and Zod for robust input validation.

## Features

-   **Add School**: Register new school records with details such as name, address, latitude, and longitude.
-   **List Schools**: Retrieve a list of all registered schools, sorted by their proximity to a given user location.

## Tech Stack

-   **Node.js**: JavaScript runtime for server-side execution.
-   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **MySQL / MariaDB**: Relational database management system used for data storage.
-   **Zod**: A TypeScript-first schema declaration and validation library.
-   **dotenv**: Module to load environment variables from a `.env` file.
-   **cors**: Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (Node Package Manager)
-   MySQL or MariaDB database server

### Installation

1.  **Clone the repository (if applicable)**:
    ```bash
    git clone <repository_url>
    cd educase-school-management
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Database Setup

Connect to your MySQL/MariaDB server and run the following SQL commands to create the database and the `schools` table:

```sql
CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables. Adjust the values as per your database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
PORT=5500
```

### Running the Project

To start the development server (with auto-reloading on file changes):

```bash
npm run dev
```

To build the project and then start the server:

```bash
npm start
```

The API server will run on `http://localhost:5500` (or the PORT specified in your `.env` file).

## API Endpoints

For detailed information on each API endpoint, including request formats, parameters, and example responses, please refer to the [TESTING.md](./TESTING.md) file.

## Postman Collection

A Postman collection is available to easily test all API endpoints. You can import the `Educase_School_Management.postman_collection.json` file into your Postman application.

## Hosted Backend

The backend API is hosted and accessible at:
[https://educase-school-management-8b5y.onrender.com](https://educase-school-management-8b5y.onrender.com)

This hosted backend utilizes a live MySQL database provided by Aiven.
