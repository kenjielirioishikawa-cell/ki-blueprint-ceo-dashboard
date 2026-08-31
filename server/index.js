import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ki_blueprint'
});

app.use(cors());
app.use(bodyParser.json());

// Routes

// Get Dashboard Overview
app.get('/api/dashboard', async (req, res) => {
  try {
    const goal = await pool.query('SELECT * FROM goals WHERE active = true ORDER BY created_at DESC LIMIT 1');
    const kpis = await pool.query('SELECT * FROM kpis WHERE period = CURRENT_DATE ORDER BY order_index');
    const risks = await pool.query('SELECT COUNT(*) as count FROM risks WHERE status = \'open\'');
    
    res.json({
      goal: goal.rows[0] || {},
      kpis_on_target: kpis.rows.filter(k => k.status === 'on_target').length,
      kpis_total: kpis.rows.length,
      open_risks: risks.rows[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// Get Priorities
app.get('/api/priorities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM priorities WHERE date = CURRENT_DATE ORDER BY order_index');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch priorities' });
  }
});

// Get AI Agents
app.get('/api/agents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ai_agents ORDER BY last_updated DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get Bottlenecks
app.get('/api/bottlenecks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bottlenecks WHERE resolved_at IS NULL ORDER BY severity DESC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bottlenecks' });
  }
});

// Get Improvement Log
app.get('/api/improvements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM improvements ORDER BY created_at DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch improvements' });
  }
});

// Get Operating Loop Steps
app.get('/api/loop', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM operating_loop ORDER BY order_index');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch loop' });
  }
});

// Update Priority Progress
app.post('/api/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const result = await pool.query('UPDATE priorities SET progress = $1 WHERE id = $2 RETURNING *', [progress, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update priority' });
  }
});

// Update Agent Status
app.post('/api/agents/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE ai_agents SET status = $1, last_updated = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

// Resolve Bottleneck
app.post('/api/bottlenecks/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE bottlenecks SET resolved_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve bottleneck' });
  }
});

// Log Improvement
app.post('/api/improvements', async (req, res) => {
  try {
    const { tag, description } = req.body;
    const result = await pool.query(
      'INSERT INTO improvements (tag, description, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [tag, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log improvement' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`KI BLUEPRINT Server running on port ${PORT}`));