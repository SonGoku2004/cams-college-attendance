const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Teacher = require('../models/Teacher');

router.get('/profile', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findByUserId(req.user.userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
