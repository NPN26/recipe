const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 8888;

// Middleware
app.use(express.static('public')); // Serves static files (HTML, CSS)
app.use(bodyParser.json());        // Parses JSON data

// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipe',
    port: 8889
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Routes
const saveData = require('./saveData');
app.use('/save', saveData);

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
