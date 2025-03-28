// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Use JSON body parser
app.use(bodyParser.json());

// Basic API key middleware (expects header: x-api-key: secret-key)
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'secret-key') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to in-memory SQLite database.");
    // Create tables and insert dummy data
    db.serialize(() => {
      db.run(`CREATE TABLE sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        amount INTEGER,
        region TEXT
      )`);

      db.run(`CREATE TABLE customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
      )`);

      // Insert sample data into sales
      db.run(`INSERT INTO sales (date, amount, region) VALUES ('2024-03-27', 500, 'North')`);
      db.run(`INSERT INTO sales (date, amount, region) VALUES ('2024-03-28', 700, 'South')`);

      // Insert sample data into customers
      db.run(`INSERT INTO customers (name, email) VALUES ('Alice', 'alice@example.com')`);
      db.run(`INSERT INTO customers (name, email) VALUES ('Bob', 'bob@example.com')`);
    });
  }
});

// Helper function: Convert natural language to pseudo-SQL
function convertQuery(nl) {
  nl = nl.toLowerCase();
  if (nl.includes("total sales")) {
    return "SELECT SUM(amount) as total_sales FROM sales;";
  } else if (nl.includes("customer")) {
    return "SELECT * FROM customers;";
  }
  // Default simulation
  return "SELECT * FROM sales;";
}

// Helper function: Provide explanation of the conversion
function explainQuery(nl) {
  nl = nl.toLowerCase();
  if (nl.includes("total sales")) {
    return "Converted to: SELECT SUM(amount) as total_sales FROM sales; because 'total sales' implies aggregation on the 'amount' column of the 'sales' table.";
  } else if (nl.includes("customer")) {
    return "Converted to: SELECT * FROM customers; to fetch all customer records.";
  }
  return "Default conversion: SELECT * FROM sales; as a fallback.";
}

// POST /query endpoint: Convert NL query to pseudo-SQL and execute it on SQLite
app.post('/query', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' in request body." });
    }
    const pseudo_sql = convertQuery(query);
    // Execute the pseudo-SQL query on the SQLite database
    db.all(pseudo_sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.json({ pseudo_sql, data: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /explain endpoint: Provide explanation for the conversion
app.post('/explain', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' in request body." });
    }
    const explanation = explainQuery(query);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /validate endpoint: Validate if pseudo-SQL references an existing table in SQLite
app.post('/validate', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing 'query' in request body." });
    }
    // Generate pseudo-SQL
    const pseudo_sql = convertQuery(query);
    // Naively extract table name after 'FROM'
    const tableNameMatch = pseudo_sql.match(/FROM\s+(\w+)/i);
    const tableName = tableNameMatch ? tableNameMatch[1] : '';
    // Check if the table exists in SQLite schema
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (row) {
          res.json({ valid: true });
        } else {
          res.json({ valid: false, errors: { table: "Table not found in schema." } });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

