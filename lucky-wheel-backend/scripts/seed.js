const { connectDB, sequelize } = require('../config/database');
const User = require('../models/User');

const students = [
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

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Connected to database. Seeding data...');

    // Clear existing data first! (Since user is replacing list)
    await User.destroy({ where: {}, truncate: true });
    console.log('🗑️ Cleared existing users.');

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
