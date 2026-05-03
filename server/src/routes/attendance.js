const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const { subject_id, date, student_id } = req.query;
    let sql = `SELECT a.*, u.name as student_name, s.name as subject_name 
              FROM attendance a 
              JOIN users u ON a.student_id = u.id 
              JOIN subjects s ON a.subject_id = s.id 
              WHERE 1=1`;
    const params = [];
    if (subject_id) { params.push(subject_id); sql += ` AND a.subject_id = ?`; }
    if (date) { params.push(date); sql += ` AND a.date = ?`; }
    if (student_id) { params.push(student_id); sql += ` AND a.student_id = ?`; }
    sql += ' ORDER BY a.date DESC, u.name';
    
    res.json(query(sql, params));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const records = req.body.records;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Records array required' });
    }

    const results = [];
    for (const record of records) {
      const { student_id, subject_id, date, status } = record;
      const existing = query(
        'SELECT id FROM attendance WHERE student_id = ? AND subject_id = ? AND date = ?',
        [student_id, subject_id, date]
      );
      
      if (existing.length > 0) {
        run(
          'UPDATE attendance SET status = ?, teacher_id = ? WHERE id = ?',
          [status, req.user.id, existing[0].id]
        );
        results.push({ id: existing[0].id, student_id, subject_id, date, status });
      } else {
        const id = uuidv4();
        const now = new Date().toISOString();
        run(
          'INSERT INTO attendance (id, student_id, subject_id, teacher_id, date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, student_id, subject_id, req.user.id, date, status, now]
        );
        results.push({ id, student_id, subject_id, date, status });
      }
    }

    res.status(201).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', authenticate, async (req, res) => {
  try {
    const { student_id, subject_id } = req.query;
    let sql = `SELECT 
                 COUNT(*) as total,
                 SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as present,
                 ROUND(CAST(SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100, 2) as percentage
               FROM attendance`;
    const params = [];
    if (student_id || subject_id) {
      sql += ' WHERE 1=1';
      if (student_id) { params.push(student_id); sql += ' AND student_id = ?'; }
      if (subject_id) { params.push(subject_id); sql += ' AND subject_id = ?'; }
    }
    res.json(query(sql, params)[0] || { total: 0, present: 0, percentage: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-stats', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can view own stats' });
    }
    
    const result = query(
      `SELECT s.id as subject_id, s.name, s.code,
              COUNT(*) as total,
              SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END as present,
              ROUND(CAST(SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100, 2) as percentage
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.student_id = ?
       GROUP BY s.id, s.name, s.code
       ORDER BY s.name`,
      [req.user.id]
    );

    const totalResult = query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as present,
              ROUND(CAST(SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100, 2) as percentage
       FROM attendance WHERE student_id = ?`,
      [req.user.id]
    );

    res.json({
      bySubject: result,
      total: totalResult[0] || { total: 0, present: 0, percentage: 0 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-attendance', authenticate, async (req, res) => {
  try {
    const { start_date, end_date, subject_id } = req.query;
    let sql = `SELECT a.*, s.name as subject_name, s.code as subject_code
               FROM attendance a
               JOIN subjects s ON a.subject_id = s.id
               WHERE a.student_id = ?`;
    const params = [req.user.id];
    
    if (start_date) { params.push(start_date); sql += ` AND a.date >= ?`; }
    if (end_date) { params.push(end_date); sql += ` AND a.date <= ?`; }
    if (subject_id) { params.push(subject_id); sql += ` AND a.subject_id = ?`; }
    sql += ' ORDER BY a.date DESC';
    
    res.json(query(sql, params));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;