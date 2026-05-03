const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send alert to student
router.post('/send-alert', auth, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { student_id, message, type } = req.body;

  // Get student email
  db.get(`SELECT u.email, u.first_name, u.last_name, s.roll_number 
          FROM students s 
          JOIN users u ON s.user_id = u.id 
          WHERE s.id = ?`, [student_id], (err, student) => {
    if (err || !student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `CAMS Alert: ${type === 'attendance' ? 'Low Attendance' : 'Fee Payment Required'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">CAMS - College Alert</h2>
          <p>Dear ${student.first_name} ${student.last_name} (${student.roll_number}),</p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #ff4444;">
            <p><strong>${message}</strong></p>
          </div>
          <p>Please contact the administration office for more details.</p>
          <p>Regards,<br/>College Administration</p>
        </div>
      `
    };

    // For demo, we'll log instead of actually sending (to avoid email config issues)
    console.log('Email would be sent:', mailOptions);
    
    // Uncomment below to actually send
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Email error:', error);
    //     return res.status(500).json({ message: 'Failed to send email' });
    //   }
    //   res.json({ message: 'Alert sent successfully' });
    // });

    res.json({ message: 'Alert logged (email sending disabled for demo)' });
  });
});

// Get notification settings
router.get('/settings', auth, (req, res) => {
  db.all('SELECT * FROM settings', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(rows);
  });
});

module.exports = router;
