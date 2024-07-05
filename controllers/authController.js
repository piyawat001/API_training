const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // เพิ่มการตรวจสอบข้อมูล
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    // ตรวจสอบว่ามีผู้ใช้นี้อยู่?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 400, message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ status: 200, message: 'success', data: { username: user.username } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ status: 400, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 401, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
    if (!user.isApproved) {
      return res.status(403).json({ 
        status: 403, 
        message: 'บัญชีของคุณยังไม่ได้รับการอนุมัติ',
        data: { 
          pendingApproval: true,
          registrationDate: user.createdAt 
        }
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ status: 200, message: 'success', data: { token } });
  } catch (error) {
    res.status(400).json({ status: 400, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
};
