const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    res.json(query('SELECT * FROM subjects ORDER BY name'));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { code, name, credits, hod_id } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();
    run(
      'INSERT INTO subjects (id, code, name, credits, hod_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, credits || 3, hod_id, now, now]
    );
    res.status(201).json({ id, code, name, credits });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Subject code already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, credits } = req.body;
    const now = new Date().toISOString();
    run(
      'UPDATE subjects SET code = COALESCE(?, code), name = COALESCE(?, name), credits = COALESCE(?, credits), updated_at = ? WHERE id = ?',
      [code || null, name || null, credits || null, now, id]
    );
    res.json({ id, code, name, credits });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('hod'), async (req, res) => {
  try {
    run('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;