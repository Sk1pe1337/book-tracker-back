const express = require('express');
const { register, login, logout, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);

module.exports = router;
