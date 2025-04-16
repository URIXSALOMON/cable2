const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// הגדרות DB דרך משתני סביבה
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false },
});

// מיד עם הפעלת השרת – צור טבלה אם לא קיימת
pool.query(`
  CREATE TABLE IF NOT EXISTS cables (
    id SERIAL PRIMARY KEY,
    type TEXT,
    location TEXT,
    length REAL,
    status TEXT,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log("✅ Table 'cables' checked/created");
}).catch(err => {
  console.error("❌ Error creating table:", err.message);
});

app.use(cors());
app.use(express.json());

// קבלת כל הכבלים
app.get('/api/cables', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cables ORDER BY installed_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// הוספת כבל חדש
app.post('/api/cables', async (req, res) => {
  const { type, location, length, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cables (type, location, length, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, location, parseFloat(length), status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
