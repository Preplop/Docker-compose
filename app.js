const express = require('express');
const { Pool } = require('pg');
const app = express();

const port = 8080;

// Database connection details from environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test DB connection and insert data
app.get('/db-test', async (req, res) => {
  try {
    // Check connection to database
    const client = await pool.connect();
    
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL
      );
    `);

    // Insert a new record
    const insertRes = await client.query(`
      INSERT INTO test_table (message) 
      VALUES ('Hello from PostgreSQL database!');
    `);

    // Query the inserted records
    const result = await client.query('SELECT * FROM test_table;');

    // Send the results back
    res.send(result.rows);

    // Close the connection
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Database error');
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
