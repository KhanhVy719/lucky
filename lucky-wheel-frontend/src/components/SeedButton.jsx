import { useState } from 'react';
import api from '../services/api';

const SeedButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!confirm('Bạn có chắc muốn thêm 44 học sinh vào database? Điều này sẽ XÓA tất cả học sinh hiện tại!')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/seed/seed');
      alert(`✅ ${response.data.message}`);
      window.location.reload();
    } catch (error) {
      alert('❌ Lỗi khi thêm học sinh: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="btn btn-secondary"
      style={{ marginTop: '20px' }}
    >
      {loading ? 'Đang thêm...' : '📥 Thêm 44 Học Sinh Mẫu'}
    </button>
  );
};

export default SeedButton;
