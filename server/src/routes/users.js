const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { role } = req.query;
    let sql = 'SELECT id, email, role, name, created_at FROM users';
    if (role) {
      sql += ' WHERE role = ?';
      return res.json(query(sql, [role]));
    }
    res.json(query(sql));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/students', authenticate, authorize('hod', 'teacher'), async (req, res) => {
  try {
    res.json(query("SELECT id, email, name, created_at FROM users WHERE role = 'student' ORDER BY name"));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/teachers', authenticate, authorize('hod'), async (req, res) => {
  try {
    res.json(query("SELECT id, email, name, created_at FROM users WHERE role = 'teacher' ORDER BY name"));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const now = new Date().toISOString();
    
    run(
      'INSERT INTO users (id, email, password, role, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, hashedPassword, role, name, now, now]
    );
    res.status(201).json({ id, email, role, name });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;
    const now = new Date().toISOString();
    run(
      'UPDATE users SET email = COALESCE(?, email), name = COALESCE(?, name), updated_at = ? WHERE id = ?',
      [email || null, name || null, now, id]
    );
    res.json({ id, email, name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('hod'), async (req, res) => {
  try {
    run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;