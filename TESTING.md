# API Testing Instructions

The Node.js API server is running on: `http://localhost:5500`

---

# 1. Add School API

-   **Endpoint:** `/api/addSchool`
-   **Method:** `POST`
-   **URL:**
    `http://localhost:5500/api/addSchool`

## Headers

```http
Content-Type: application/json
```

## Request Body

```json
{
	"name": "Example School 1",
	"address": "123 Main St, Anytown",
	"latitude": 34.052235,
	"longitude": -118.243683
}
```

## Success Response

```json
{
	"message": "School added successfully",
	"schoolId": 1
}
```

> `schoolId` increments automatically for each new school added.

---

# 2. List Schools API

-   **Endpoint:** `/api/listSchools`
-   **Method:** `GET`
-   **URL:**
    `http://localhost:5500/api/listSchools`

## Query Parameters

| Parameter | Type   | Description    |
| --------- | ------ | -------------- |
| latitude  | number | User latitude  |
| longitude | number | User longitude |

## Example Request

```text
http://localhost:5500/api/listSchools?latitude=34.052235&longitude=-118.243683
```

## Success Response

```json
[
	{
		"id": 1,
		"name": "Example School 1",
		"address": "123 Main St, Anytown",
		"latitude": 34.052235,
		"longitude": -118.243683,
		"distance": 0
	}
]
```

> Schools are returned sorted by proximity (nearest first) based on the provided coordinates.

---

---

# 6. Tech Stack

-   Node.js
-   Express.js
-   TypeScript
-   MySQL / MariaDB
-   Zod Validation

---

# 7. Running the Project

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

The server will start on:

```text
http://localhost:5500
```

---

# 8. Database Setup

Run the following SQL commands inside MySQL/MariaDB:

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

---

# 9. Environment Variables

Create a `.env` file in the project root:

```env
# Local Development Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306

PORT=5500
```

---

# 10. Connecting to Aiven Live Database

To test against the live database hosted on Aiven, update your `.env` file with the following environment variables.
**Note:** The `ssl: { rejectUnauthorized: false }` option is required in `src/config/db.ts` for Aiven connections.

```env
DB_HOST=<YOUR_AIVEN_DB_HOST>
DB_PORT=<YOUR_AIVEN_DB_PORT>
DB_USER=<YOUR_AIVEN_DB_USER>
DB_PASSWORD=<YOUR_AIVEN_DB_PASSWORD>
DB_NAME=<YOUR_AIVEN_DB_NAME>

PORT=5500
```
