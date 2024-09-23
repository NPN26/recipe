const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'recipe',
    port: 8889
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/recipe/index.php/public/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.json({ status: 'success' });
    } else {
      res.json({ status: 'error', message: 'Invalid credentials' });
    }
  });
});

app.listen(8888, () => {
  console.log('Server running on port 8888');
});
