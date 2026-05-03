const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HOD = require('../models/HOD');

router.get('/profile', auth, async (req, res) => {
  try {
    const hod = await HOD.findByUserId(req.user.userId);
    if (!hod) {
      return res.status(404).json({ message: 'HOD profile not found' });
    }
    res.json(hod);
  } catch (error) {
    console.error('Get HOD profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
