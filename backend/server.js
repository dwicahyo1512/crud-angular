const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Konfigurasi koneksi MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'angular',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

// Route GET (Read All)
app.get('/api/data', (req, res) => {
  pool.query('SELECT id, title, body FROM post', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// Route GET (Read One by ID)
app.get('/api/data/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT id, title, body FROM post WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(results[0]);
  });
});

// Route POST (Create)
app.post('/api/data', (req, res) => {
  const { title, body } = req.body;
  pool.query('INSERT INTO post (title, body) VALUES (?, ?)', [title, body], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: result.insertId, title, body });
  });
});

// Route PUT (Update)
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  pool.query('UPDATE post SET title = ?, body = ? WHERE id = ?', [title, body, id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ id: parseInt(id), title, body });
  });
});

// Route DELETE
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM post WHERE id = ?', [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: 'Data deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
