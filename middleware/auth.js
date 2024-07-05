const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ status: 401, message: 'ไม่พบ token การยืนยันตัวตน' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token); // ล็อก token

    console.log('JWT_SECRET:', process.env.JWT_SECRET); // ล็อก JWT_SECRET

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // ล็อก token ที่ถูก decode
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ status: 401, message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
      }
      return res.status(401).json({ status: 401, message: 'Token ไม่ถูกต้อง' });
    }

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res.status(401).json({ status: 401, message: 'ไม่พบผู้ใช้ในระบบ' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาดในการยืนยันตัวตน' });
  }
};

module.exports = auth;
