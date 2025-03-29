# Mini Data Query Simulation Engine

## Overview

This project is a lightweight backend service that simulates a simplified version of a Gen AI Analytics data query system. It allows users to submit natural language queries and receive pseudo-SQL translations along with mock database results.

## Features

- Accepts natural language queries and translates them into pseudo-SQL.
- Provides an explanation of how the query is translated.
- Validates the feasibility of the query.
- Uses an in-memory SQLite database to simulate data queries.
- Implements basic authentication using an API key.
- Includes error handling to ensure robustness.

## Tech Stack

- **Language:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (in-memory)

## API Endpoints

### 1. `/query`

**Method:** `POST`\
**Description:** Converts a natural language query into a pseudo-SQL statement and executes it on the mock database.

**Request Body:**

```json
{
  "query": "What is the total sales?"
}
```

**Response:**

```json
{
  "pseudo_sql": "SELECT SUM(amount) as total_sales FROM sales;",
  "data": [{ "total_sales": 1200 }]
}
```

---

### 2. `/explain`

**Method:** `POST`\
**Description:** Provides an explanation of how the natural language query is translated.

**Request Body:**

```json
{
  "query": "What is the total sales?"
}
```

**Response:**

```json
{
  "explanation": "Converted to: SELECT SUM(amount) as total_sales FROM sales; because 'total sales' implies aggregation on the 'amount' column of the 'sales' table."
}
```

---

### 3. `/validate`

**Method:** `POST`\
**Description:** Checks if the pseudo-SQL references an existing table in the SQLite database.

**Request Body:**

```json
{
  "query": "Show all customers"
}
```

**Response:**

```json
{
  "valid": true
}
```

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (>=14.x)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/rahulbhattsd/GrowthGear.git
   cd GrowthGear
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the server:**
   ```sh
   node server.js
   ```
4. **Test the API using Postman or curl:**
   ```sh
   curl -X POST http://localhost:3000/query -H "x-api-key: secret-key" -H "Content-Type: application/json" -d '{"query": "What is the total sales?"}'
   ```

## Deployment

This project can be deployed on platforms like:

- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/)
- [Railway](https://railway.app/)

To deploy on **Heroku**, follow these steps:

```sh
git init
git add .
git commit -m "Initial commit"
heroku create
heroku git:remote -a your-app-name
git push heroku main
```

## Authentication

All API endpoints require an `x-api-key` header with the value `secret-key`.

Example request:

```sh
curl -X POST http://localhost:3000/query -H "x-api-key: secret-key" -H "Content-Type: application/json" -d '{"query": "Show all customers"}'
```

## Evaluation Criteria

- Code quality and maintainability
- API design and efficiency
- Query simulation accuracy
- Robust error handling
- Clear and detailed documentation

## License

This project is licensed under the MIT License.

---

Feel free to fork and contribute! 🚀


 
