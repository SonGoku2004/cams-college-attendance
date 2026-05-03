const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const { subject_id } = req.query;
    let sql = `SELECT a.*, s.name as subject_name, s.code as subject_code
              FROM assignments a
              JOIN subjects s ON a.subject_id = s.id WHERE 1=1`;
    const params = [];
    if (subject_id) { params.push(subject_id); sql += ' AND a.subject_id = ?'; }
    res.json(query(sql + ' ORDER BY a.due_date', params));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authenticate, authorize('teacher', 'hod'), async (req, res) => {
  try {
    const { subject_id, title, description, due_date, created_by } = req.body;
    const id = uuidv4();
    const now = new Date().toISOString();
    run(
      'INSERT INTO assignments (id, subject_id, title, description, due_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, subject_id, title, description, due_date, created_by || req.user.id, now]
    );
    res.status(201).json({ id, subject_id, title, description, due_date });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:id/submissions', authenticate, authorize('teacher', 'hod'), async (req, res) => {
  try {
    res.json(query(
      `SELECT sub.*, u.name as student_name, u.email as student_email
       FROM submissions sub
       JOIN users u ON sub.student_id = u.id
       WHERE sub.assignment_id = ?`,
      [req.params.id]
    ));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentId = req.user.role === 'student' ? req.user.id : req.body.student_id;
    const existing = query('SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?', [assignmentId, studentId]);
    const now = new Date().toISOString();
    
    if (existing.length > 0) {
      run(
        'UPDATE submissions SET status = ?, submitted_at = ? WHERE id = ?',
        ['submitted', now, existing[0].id]
      );
      res.json({ id: existing[0].id, status: 'submitted' });
    } else {
      const id = uuidv4();
      run(
        'INSERT INTO submissions (id, assignment_id, student_id, status, submitted_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, assignmentId, studentId, 'submitted', now, now]
      );
      res.status(201).json({ id, status: 'submitted' });
    }
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/grade', authenticate, authorize('teacher', 'hod'), async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, grade, feedback } = req.body;
    run(
      `UPDATE submissions SET grade = ?, feedback = ?, status = 'graded'
       WHERE assignment_id = ? AND student_id = ?`,
      [grade, feedback, id, student_id]
    );
    res.json({ message: 'Graded' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;