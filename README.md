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
**Method:** `POST`  
**Description:** Converts a natural language query into a pseudo-SQL statement and executes it on the mock database.

**Request Body:**
```json
{
  "query": "What is the total sales?"
}





 
