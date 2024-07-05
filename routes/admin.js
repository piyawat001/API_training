// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// ดึงรายการผู้ใช้ที่รอการอนุมัติ
router.get('/pending-users', auth, adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json({ status: 200, message: 'success', data: pendingUsers });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// อนุมัติผู้ใช้
router.put('/approve-user/:userId', auth, adminAuth, async (req, res) => {
  try {
    console.log('Approving user:', req.params.userId);
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { isApproved: true }, 
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: 404, message: 'ไม่พบผู้ใช้' });
    }
    console.log('User approved:', user.username);
    res.json({ status: 200, message: 'อนุมัติผู้ใช้สำเร็จ', data: { username: user.username } });
  } catch (error) {
    console.error('Error approving user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 400, message: 'รูปแบบ ID ไม่ถูกต้อง' });
    }
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการอนุมัติผู้ใช้' });
  }
});
module.exports = router;