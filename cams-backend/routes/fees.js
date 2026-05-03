const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all fee records (HOD only)
router.get('/', auth, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  db.all(`SELECT f.*, s.roll_number, u.first_name, u.last_name 
          FROM fees f 
          JOIN students s ON f.student_id = s.id
          JOIN users u ON s.user_id = u.id
          ORDER BY f.status, s.roll_number`, [], (err, rows) => {
    if (err) {
      console.error('Error fetching fees:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(rows);
  });
});

// Add fee record
router.post('/', auth, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const { student_id, amount, due_date } = req.body;
  
  db.run(`INSERT INTO fees (student_id, amount, due_date, status) 
          VALUES (?, ?, ?, 'pending')`, 
    [student_id, amount, due_date], function(err) {
      if (err) {
        console.error('Error adding fee:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ id: this.lastID, message: 'Fee record added' });
    });
});

// Update payment
router.put('/:id/pay', auth, (req, res) => {
  if (req.user.role !== 'hod') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  const { amount } = req.body;
  
  db.get('SELECT * FROM fees WHERE id = ?', [req.params.id], (err, fee) => {
    if (err || !fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }
    
    const newPaid = (fee.paid_amount || 0) + parseFloat(amount);
    const status = newPaid >= fee.amount ? 'paid' : 'partial';
    
    db.run(`UPDATE fees SET paid_amount = ?, status = ?, payment_date = ? 
            WHERE id = ?`,
      [newPaid, status, new Date().toISOString().split('T')[0], req.params.id], 
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Payment updated' });
      });
  });
});

module.exports = router;
