import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LuckyWheel from './components/LuckyWheel';
import AdminPanel from './components/AdminPanel';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '3rem', 
          fontWeight: '800',
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '40px'
        }}>
          🎡 Vòng Quay May Mắn
        </h1>
        
        <Routes>
          <Route path="/" element={<LuckyWheel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
