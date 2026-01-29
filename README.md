# 🎡 Lucky Wheel - README

## Tổng Quan

Ứng dụng vòng quay may mắn với backend (Node.js/Express/MongoDB) và frontend (React/Vite), có admin panel để quản lý người dùng và cơ chế blacklist bí mật.

## 🚀 Cài Đặt & Chạy

### Backend

```bash
cd lucky-wheel-backend
npm install
npm start
```

Server chạy tại: `http://localhost:3000`

### Frontend

```bash
cd lucky-wheel-frontend
npm install
npm run dev
```

App chạy tại: `http://localhost:5173`

## 📖 Hướng Dẫn Sử Dụng

### 1. Vòng Quay (Trang Công Khai)

**URL:** `http://localhost:5173/`

- Xem vòng quay với tất cả người dùng
- Click "🎯 QUAY NGAY!" để quay
- Xem kết quả với hiệu ứng confetti

> **Lưu ý:** Người chơi KHÔNG thấy ai bị blacklist. Tất cả hiển thị bình thường!

### 2. Admin Panel

**URL:** `http://localhost:5173/admin`

**Đăng nhập:**

- Mật khẩu: `admin123`

**Chức năng:**

- ➕ Thêm người dùng mới
- ☑️ Đánh dấu blacklist (checkbox)
- 🗑️ Xóa người dùng

## 🔐 Cơ Chế Blacklist

### Cách Hoạt Động

1. **Admin Panel:** Đánh dấu user bị blacklist bằng checkbox
2. **Backend:** Chỉ chọn users KHÔNG bị blacklist khi quay
3. **Frontend (Vòng Quay):** Hiển thị TẤT CẢ users bình thường, KHÔNG phân biệt

### Ví Dụ

- Có 10 users total
- Admin đánh dấu blacklist 6 users
- Vòng quay vẫn hiển thị cả 10 users
- Nhưng CHỈ 4 users không bị blacklist có thể trúng

## 🛠️ Công Nghệ Sử Dụng

### Backend

- Node.js + Express
- MongoDB (Railway)
- Mongoose
- CORS

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Canvas API (cho vòng quay)

## 📂 Cấu Trúc Dự Án

```
lucky-wheel-backend/
├── models/User.js       # Schema với blacklisted field
├── routes/
│   ├── auth.js          # Login
│   ├── users.js         # CRUD + blacklist
│   └── spin.js          # Logic quay
└── server.js

lucky-wheel-frontend/
├── src/
│   ├── components/
│   │   ├── LuckyWheel.jsx    # Vòng quay
│   │   └── AdminPanel.jsx    # Quản lý
│   ├── services/api.js       # API calls
│   └── App.jsx
```

## 🎨 Tính Năng UI

- ✨ Dark theme cao cấp
- 🌟 Glassmorphism effects
- 🎯 Smooth animations
- 🎊 Confetti effect khi trúng
- 📱 Responsive design

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/login` - Đăng nhập admin

### Users

- `GET /api/users` - Lấy danh sách
- `POST /api/users` - Thêm mới
- `PATCH /api/users/:id/blacklist` - Toggle blacklist
- `DELETE /api/users/:id` - Xóa

### Spin

- `POST /api/spin` - Quay vòng quay

## ⚙️ Cấu Hình

### Backend (.env)

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=admin123
```

### Frontend (API URL)

File: `src/services/api.js`

```javascript
const API_BASE_URL = "http://localhost:3000/api";
```

## 📝 Notes

- Mật khẩu admin mặc định: `admin123`
- MongoDB connection từ Railway
- Blacklist status CHỈ hiện trong admin panel
- Vòng quay công khai KHÔNG lộ thông tin blacklist

## 🎯 Testing

1. Mở admin panel và thêm 5-10 users
2. Đánh dấu blacklist một số users
3. Quay về trang vòng quay
4. Thử quay nhiều lần
5. Verify: Winner KHÔNG BAO GIỜ là người bị blacklist

## 📦 Dependencies

Tất cả dependencies đã được cài đặt. Xem `package.json` trong mỗi folder để biết chi tiết.
