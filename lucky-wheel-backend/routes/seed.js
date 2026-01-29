const express = require('express');
const router = express.Router();
const User = require('../models/User');

const defaultStudents = [
  'Nguyễn Bảo Anh', 'Trần Minh Đức', 'Lê Hoàng Nam', 'Phạm Khánh Vy', 'Hoàng Gia Bảo',
  'Huỳnh Tuấn Kiệt', 'Phan Thảo My', 'Vũ Ngọc Hân', 'Võ Minh Khôi', 'Đặng Nhật Minh',
  'Bùi Phương Thảo', 'Đỗ Gia Hưng', 'Hồ Bảo Ngọc', 'Ngô Anh Thư', 'Dương Minh Triết',
  'Lý Tường Vy', 'Nguyễn Minh Quân', 'Trần Thanh Hà', 'Lê Quang Huy', 'Phạm Mai Hương',
  'Hoàng Thái Sơn', 'Huỳnh Thanh Trúc', 'Phan Minh Nhật', 'Vũ Thu Trang', 'Võ Tấn Phát',
  'Đặng Thùy Dương', 'Bùi Tiến Đạt', 'Đỗ Hồng Nhung', 'Hồ Quang Dũng', 'Ngô Bảo Châu',
  'Dương Thuý Vi', 'Lý Quốc Bảo', 'Nguyễn Hữu Nghĩa', 'Trần Kim Chi', 'Lê Đức Thắng',
  'Phạm Ngọc Linh', 'Hoàng Thùy Chi', 'Huỳnh Anh Khoa', 'Phan Cẩm Ly', 'Vũ Đình Trọng',
  'Võ Minh Thư', 'Đặng Ngọc Trâm', 'Bùi Quang Hải', 'Đỗ Thanh Hằng'
];

router.post('/', async (req, res) => {
  try {
    const { users } = req.body; // Expecting array of { name: '...' }

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const createdUsers = await User.bulkCreate(users);

    res.status(201).json({
      success: true,
      message: `Added ${createdUsers.length} users`,
      users: createdUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to seed default 44 students
router.post('/defaults', async (req, res) => {
  try {
    // Optional: Clear existing users first? Or just append?
    // Let's just append to be safe, or user can clear manually.
    // User requested "setup luôn", implies fresh start usually.
    // But let's just add.
    
    const userObjects = defaultStudents.map(name => ({ name }));
    const createdUsers = await User.bulkCreate(userObjects);

    res.status(201).json({
      success: true,
      message: `Đã thêm thành công ${createdUsers.length} học sinh mẫu!`,
      users: createdUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear all users route
router.delete('/', async (req, res) => {
   try {
     await User.destroy({
       where: {},
       truncate: true // Faster
     });
     res.json({ message: 'All users cleared' });
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
});

module.exports = router;
