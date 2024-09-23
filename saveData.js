const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// MySQL Connection Setup (Reuse or refactor if needed)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipe',
    port: 8889
});

// POST route to save data
router.post('/', (req, res) => {
  const { name, email } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [name, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving data' });
    }
    res.status(200).json({ message: 'Data saved successfully!' });
  });
});

module.exports = router;
