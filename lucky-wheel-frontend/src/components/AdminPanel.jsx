import { useState, useEffect } from 'react';
import { 
  login, 
  logout, 
  isAuthenticated, 
  getAllUsers, 
  createUser, 
  toggleBlacklist, 
  deleteUser 
} from '../services/api';
import SeedButton from './SeedButton';

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '' });

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(password);
      setAuthenticated(true);
      setPassword('');
      fetchUsers();
    } catch (error) {
      alert('Mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUsers([]);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name) {
      alert('Vui lòng nhập tên học sinh!');
      return;
    }

    try {
      await createUser(newUser);
      setNewUser({ name: '' });
      fetchUsers();
      alert('Thêm học sinh thành công!');
    } catch (error) {
      alert('Lỗi khi thêm học sinh: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleToggleBlacklist = async (userId) => {
    try {
      await toggleBlacklist(userId);
      fetchUsers();
    } catch (error) {
      alert('Lỗi khi thay đổi trạng thái blacklist');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc muốn xóa học sinh này?')) {
      return;
    }

    try {
      await deleteUser(userId);
      fetchUsers();
      alert('Xóa học sinh thành công!');
    } catch (error) {
      alert('Lỗi khi xóa học sinh');
    }
  };

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="glass-card" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
            🔐 Admin Login
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="input mb-4"
              placeholder="Nhập mật khẩu admin..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Đăng Nhập
            </button>
          </form>
          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Mật khẩu mặc định: admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>👥 Quản Lý Học Sinh</h2>
        <button onClick={handleLogout} className="btn btn-outline">
          Đăng Xuất
        </button>
      </div>

      {/* Add User Form */}
      <div className="glass-card mb-8" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>➕ Thêm Học Sinh Mới</h3>
        <form onSubmit={handleCreateUser} className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input"
            placeholder="Tên học sinh"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={{ flex: '1', minWidth: '300px' }}
          />
          <button type="submit" className="btn btn-primary">
            Thêm
          </button>
        </form>
        <SeedButton />
      </div>

      {/* Users Table */}
      <div className="glass-card">
        {loading ? (
          <div className="flex justify-center items-center" style={{ padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có học sinh nào. Hãy thêm học sinh mới!
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Học Sinh</th>
                  <th>Trạng Thái</th>
                  <th>Blacklist</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: '600' }}>{index + 1}</td>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>
                      {user.blacklisted ? (
                        <span className="badge badge-danger">KHÔNG THỂ TRÚNG</span>
                      ) : (
                        <span className="badge badge-success">CÓ THỂ TRÚNG</span>
                      )}
                    </td>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={user.blacklisted}
                          onChange={() => handleToggleBlacklist(user._id)}
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            cursor: 'pointer',
                            accentColor: 'var(--primary)'
                          }}
                        />
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {user.blacklisted ? 'Đã blacklist' : 'Chưa blacklist'}
                        </span>
                      </label>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card mt-8" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: 'var(--text-primary)' }}>
          ℹ️ Hướng Dẫn Sử Dụng
        </h3>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>
            <strong>Blacklist:</strong> Người dùng được đánh dấu <span className="badge badge-danger" style={{ fontSize: '10px' }}>KHÔNG THỂ TRÚNG</span> sẽ 
            <strong> KHÔNG BAO GIỜ</strong> được chọn khi quay vòng quay.
          </li>
          <li>
            <strong>Vòng quay công khai:</strong> Người chơi sẽ KHÔNG thấy ai bị blacklist, tất cả hiển thị bình thường.
          </li>
          <li>
            <strong>Chỉ admin:</strong> Mới có thể xem và thay đổi trạng thái blacklist ở trang này.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
