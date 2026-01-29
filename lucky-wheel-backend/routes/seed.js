const express = require('express');
const router = express.Router();
const User = require('../models/User');

const defaultStudents = [
  'Dương Thuỳ An', 'Võ Văn Lê Dũng', 'Lê Thị Duyên', 'Nguyễn Văn Dưỡng', 'Lê Xuân Đạt',
  'Lê Thị Hiền', 'Lê Thị Thu Hiền', 'Nguyễn Văn Hiếu', 'Lê Huy Hoàng', 'Bùi Công Hùng',
  'Hoàng Kim Hưng', 'Hoàng Văn Khánh', 'Nguyễn Thị Kim Lan', 'Dương Thị Linh', 'Dương Thị Thuỳ Linh',
  'Nguyễn Hoàng Long', 'Lê Thị Thảo Ly', 'Trần Thị Ni Na', 'Nguyễn Văn Nam', 'Nguyễn Duy Nghĩa',
  'Lương Văn Ngọc', 'Võ Trương Bảo Ngọc', 'Lê Đức Nguyễn', 'Nguyễn Thị Hà Nhi', 'Nguyễn Hồng Quân',
  'Nguyễn Thành Quân', 'Nguyễn Thị Lệ Quyên', 'Lê Văn Sỹ', 'Nguyễn Văn Tài', 'Nguyễn Thị Thanh Tâm',
  'Trần Thị Mỹ Tâm', 'Nguyễn Xuân Thịnh', 'Lê Thị Thu Thuý', 'Phạm Anh Thư', 'Nguyễn Đình Tiến',
  'Nguyễn Thị Ngọc Tính', 'Lê Thuỳ Trang', 'Lê Thị Thu Thuý', 'Phạm Thị Tươi', // Typo in original list checked
  'Lê Thị Hồng Trinh', 'Đinh Thị Ánh Tuyết', 'Phạm Thị Tươi', 'Hoàng Văn Vũ', 'Nguyễn Ngọc Vũ',
  'Lê Võ Sang Xuân', 'Đinh Ngọc Như Ý'
];
// Note: I will copy the EXACT array from the previous tool call to ensure consistency.

const exactStudents = [
  'Dương Thuỳ An', 'Võ Văn Lê Dũng', 'Lê Thị Duyên', 'Nguyễn Văn Dưỡng', 'Lê Xuân Đạt',
  'Lê Thị Hiền', 'Lê Thị Thu Hiền', 'Nguyễn Văn Hiếu', 'Lê Huy Hoàng', 'Bùi Công Hùng',
  'Hoàng Kim Hưng', 'Hoàng Văn Khánh', 'Nguyễn Thị Kim Lan', 'Dương Thị Linh', 'Dương Thị Thuỳ Linh',
  'Nguyễn Hoàng Long', 'Lê Thị Thảo Ly', 'Trần Thị Ni Na', 'Nguyễn Văn Nam', 'Nguyễn Duy Nghĩa',
  'Lương Văn Ngọc', 'Võ Trương Bảo Ngọc', 'Lê Đức Nguyễn', 'Nguyễn Thị Hà Nhi', 'Nguyễn Hồng Quân',
  'Nguyễn Thành Quân', 'Nguyễn Thị Lệ Quyên', 'Lê Văn Sỹ', 'Nguyễn Văn Tài', 'Nguyễn Thị Thanh Tâm',
  'Trần Thị Mỹ Tâm', 'Nguyễn Xuân Thịnh', 'Lê Thị Thu Thuý', 'Phạm Anh Thư', 'Nguyễn Đình Tiến',
  'Nguyễn Thị Ngọc Tính', 'Lê Thuỳ Trang', 'Lê Thị Hồng Trinh', 'Đinh Thị Ánh Tuyết', 'Phạm Thị Tươi',
  'Hoàng Văn Vũ', 'Nguyễn Ngọc Vũ', 'Lê Võ Sang Xuân', 'Đinh Ngọc Như Ý'
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
    // Clear old data for a fresh start with this specific class
    await User.destroy({ where: {}, truncate: true });
    
    const userObjects = exactStudents.map(name => ({ name }));
    const createdUsers = await User.bulkCreate(userObjects);

    res.status(201).json({
      success: true,
      message: `Đã cập nhật danh sách ${createdUsers.length} học sinh 12A8!`, // Assuming class name or generic
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
       truncate: true
     });
     res.json({ message: 'All users cleared' });
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
});

module.exports = router;
