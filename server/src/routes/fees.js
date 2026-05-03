const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      return res.json(query('SELECT * FROM fees WHERE student_id = ? ORDER BY due_date', [req.user.id]));
    }
    const { student_id, status } = req.query;
    let sql = 'SELECT f.*, u.name as student_name FROM fees f JOIN users u ON f.student_id = u.id WHERE 1=1';
    const params = [];
    if (student_id) { params.push(student_id); sql += ' AND f.student_id = ?'; }
    if (status) { params.push(status); sql += ' AND f.status = ?'; }
    res.json(query(sql + ' ORDER BY f.due_date', params));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { student_id, amount, due_date, academic_year, semester } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();
    run(
      'INSERT INTO fees (id, student_id, amount, due_date, academic_year, semester, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, student_id, amount, due_date, academic_year, semester, now]
    );
    res.status(201).json({ id, student_id, amount, due_date, academic_year, semester });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/pay', authenticate, authorize('hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString().split('T')[0];
    run(
      "UPDATE fees SET status = 'paid', paid_date = ? WHERE id = ?",
      [now, id]
    );
    res.json({ message: 'Marked as paid' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-fees', authenticate, async (req, res) => {
  try {
    res.json(query('SELECT * FROM fees WHERE student_id = ? ORDER BY due_date', [req.user.id]));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;