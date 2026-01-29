const { connectDB, sequelize } = require('../config/database');
const User = require('../models/User');

const students = [
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

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Connected to database. Seeding data...');

    // Bulk create
    const userObjects = students.map(name => ({ name }));
    await User.bulkCreate(userObjects);

    console.log(`✅ Successfully added ${students.length} students to the database.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
