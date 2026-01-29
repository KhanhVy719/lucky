const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to check admin auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// POST seed students data
router.post('/seed', authMiddleware, async (req, res) => {
  try {
    // Clear existing users first
    await User.deleteMany({});
    
    // List of 44 students
    const students = [
      "Dương Thuỳ An",
      "Võ Văn Lê Dũng",
      "Lê Thị Duyên",
      "Nguyễn Văn Dưỡng",
      "Lê Xuân Đạt",
      "Lê Thị Hiền",
      "Lê Thị Thu Hiền",
      "Nguyễn Văn Hiếu",
      "Lê Huy Hoàng",
      "Bùi Công Hùng",
      "Hoàng Kim Hưng",
      "Hoàng Văn Khánh",
      "Nguyễn Thị Kim Lan",
      "Dương Thị Linh",
      "Dương Thị Thuỳ Linh",
      "Nguyễn Hoàng Long",
      "Lê Thị Thảo Ly",
      "Trần Thị Ni Na",
      "Nguyễn Văn Nam",
      "Nguyễn Duy Nghĩa",
      "Lương Văn Ngọc",
      "Võ Trương Bảo Ngọc",
      "Lê Đức Nguyễn",
      "Nguyễn Thị Hà Nhi",
      "Nguyễn Hồng Quân",
      "Nguyễn Thành Quân",
      "Nguyễn Thị Lệ Quyên",
      "Lê Văn Sỹ",
      "Nguyễn Văn Tài",
      "Nguyễn Thị Thanh Tâm",
      "Trần Thị Mỹ Tâm",
      "Nguyễn Xuân Thịnh",
      "Lê Thị Thu Thuý",
      "Phạm Anh Thư",
      "Nguyễn Đình Tiến",
      "Nguyễn Thị Ngọc Tính",
      "Lê Thuỳ Trang",
      "Lê Thị Hồng Trinh",
      "Đinh Thị Ánh Tuyết",
      "Phạm Thị Tươi",
      "Hoàng Văn Vũ",
      "Nguyễn Ngọc Vũ",
      "Lê Võ Sang Xuân",
      "Đinh Ngọc Như Ý"
    ];
    
    // Insert all students
    const userDocuments = students.map(name => ({
      name,
      blacklisted: false
    }));
    
    const createdUsers = await User.insertMany(userDocuments);
    
    res.json({
      success: true,
      message: `Added ${createdUsers.length} students`,
      count: createdUsers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
