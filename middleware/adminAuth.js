const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.log('Admin access denied for user:', req.user ? req.user._id : 'Unknown');
    res.status(403).json({ status: 403, message: 'ไม่มีสิทธิ์เข้าถึง' });
  }
};

module.exports = adminAuth;