const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    let sql = 'SELECT * FROM notices WHERE 1=1';
    const params = [];
    if (req.user.role === 'student') {
      params.push(req.user.id);
      sql += ' AND student_id = ?';
    } else if (req.query.student_id) {
      params.push(req.query.student_id);
      sql += ' AND student_id = ?';
    }
    res.json(query(sql + ' ORDER BY created_at DESC', params));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authenticate, authorize('hod', 'teacher'), async (req, res) => {
  try {
    const { student_ids, type, message } = req.body;
    if (student_ids && Array.isArray(student_ids)) {
      for (const student_id of student_ids) {
        const id = uuidv4();
        const now = new Date().toISOString();
        run('INSERT INTO notices (id, student_id, type, message, created_at) VALUES (?, ?, ?, ?, ?)', [id, student_id, type, message, now]);
      }
    } else if (req.body.student_id) {
      const id = uuidv4();
      const now = new Date().toISOString();
      run('INSERT INTO notices (id, student_id, type, message, created_at) VALUES (?, ?, ?, ?, ?)', [id, req.body.student_id, type, message, now]);
    }
    res.status(201).json({ message: 'Notice sent' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    run('UPDATE notices SET is_read = 1 WHERE id = ? AND student_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/my-notices', authenticate, async (req, res) => {
  try {
    res.json(query('SELECT * FROM notices WHERE student_id = ? ORDER BY created_at DESC', [req.user.id]));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;