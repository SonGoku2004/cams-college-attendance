const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/attendance-daily', authenticate, authorize('teacher', 'hod'), async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const result = query(
      `SELECT u.name as student_name, u.email, s.name as subject_name, s.code, a.status, a.date
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.date = ?
       ORDER BY s.name, u.name`,
      [targetDate]
    );

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'College Attendance System';
    workbook.created = new Date();
    
    const sheet = workbook.addWorksheet('Daily Attendance');
    sheet.columns = [
      { header: 'Student Name', key: 'student_name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Subject', key: 'subject_name', width: 20 },
      { header: 'Subject Code', key: 'code', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Date', key: 'date', width: 15 }
    ];
    
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
    
    result.forEach(row => sheet.addRow(row));
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${targetDate}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/attendance-summary', authenticate, authorize('hod'), async (req, res) => {
  try {
    const result = query(`
      SELECT u.name as student_name, u.email, s.name as subject_name,
              COUNT(*) as total_classes,
              SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) as classes_attended,
              ROUND(CAST(SUM(CASE WHEN a.status IN ('present', 'late') THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100, 2) as attendance_percentage
       FROM attendance a
       JOIN users u ON a.student_id = u.id
       JOIN subjects s ON a.subject_id = s.id
       GROUP BY u.id, u.name, u.email, s.id, s.name
       ORDER BY u.name
    `);
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'College Attendance System';
    const sheet = workbook.addWorksheet('Attendance Summary');
    
    sheet.columns = [
      { header: 'Student Name', key: 'student_name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Subject', key: 'subject_name', width: 20 },
      { header: 'Total Classes', key: 'total_classes', width: 15 },
      { header: 'Attended', key: 'classes_attended', width: 12 },
      { header: 'Attendance %', key: 'attendance_percentage', width: 15 }
    ];
    
    sheet.getRow(1).font = { bold: true };
    result.forEach(row => sheet.addRow(row));
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_summary.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;