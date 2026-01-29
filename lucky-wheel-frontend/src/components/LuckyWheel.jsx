import { useEffect, useRef, useState } from 'react';
import { getAllUsers, spinWheel } from '../services/api';

const LuckyWheel = () => {
  const canvasRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(null);

  const [spinCount, setSpinCount] = useState(1);
  const [sessionWinners, setSessionWinners] = useState([]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 280;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    const angleStep = (2 * Math.PI) / users.length;
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

    users.forEach((user, index) => {
      const startAngle = index * angleStep;
      const endAngle = startAngle + angleStep;

      // Draw segment
      ctx.beginPath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.rotate(startAngle + angleStep / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Inter';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
      ctx.fillText(user.name, radius - 15, 5);
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 15, centerY);
    ctx.lineTo(centerX + radius + 40, centerY - 20);
    ctx.lineTo(centerX + radius + 40, centerY + 20);
    ctx.closePath();
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại đường truyền.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      drawWheel();
    }
  }, [users, rotation]);

  const handleSpin = async () => {
    if (spinning || users.length === 0) return;

    setSessionWinners([]); 
    
    let currentSpin = 0;
    const maxSpins = spinCount;
    const newSessionWinners = [];

    const spinOneTurnInternal = async (startRot) => {
      if (currentSpin >= maxSpins) {
        setSpinning(false);
        return;
      }
      
      setSpinning(true);
      
      try {
        const excludedIds = newSessionWinners.map(w => w._id);
        
         const result = await spinWheel(excludedIds);
          if (!result.success) {
            alert('Hết người để quay!');
            setSpinning(false);
            return;
          }
          
          const winnerIndex = users.findIndex(u => u._id === result.winner.id);
          const angleStep = (Math.PI * 2) / users.length;
          const randomOffset = 0.1 + Math.random() * 0.8;
          const winnerAngle = (winnerIndex * angleStep) + (angleStep * randomOffset);
          
          const currentRotationMod = startRot % (Math.PI * 2);
          const targetAnglePos = (Math.PI * 2) - winnerAngle;
          let delta = targetAnglePos - currentRotationMod;
          if (delta < 0) delta += (Math.PI * 2);
          const minFullSpins = 4; 
          const extraSpins = minFullSpins * (Math.PI * 2);
          const targetRotation = startRot + delta + extraSpins;
          
          const startTime = Date.now();
          const duration = 4000;

          const animate = () => {
             const elapsed = Date.now() - startTime;
             const progress = Math.min(elapsed / duration, 1);
             const easeOutCubic = 1 - Math.pow(1 - progress, 3);
             const currentRot = startRot + (targetRotation - startRot) * easeOutCubic;
             setRotation(currentRot);
             
             if (progress < 1) requestAnimationFrame(animate);
             else {
                const winnerData = { ...result.winner, _id: result.winner.id };
                setWinner(winnerData);
                setSessionWinners(prev => [...prev, winnerData]);
                newSessionWinners.push(winnerData);
                triggerConfetti();
                currentSpin++;
                setTimeout(() => spinOneTurnInternal(currentRot), 2000);
             }
          };
          requestAnimationFrame(animate);
      } catch (err) {
         setSpinning(false);
         alert(err.message);
      }
    };

    spinOneTurnInternal(rotation);
  };
  
  const triggerConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 5 + 2,
        speedY: Math.random() * 3 + 2,
        color: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)]
      });
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.y += p.speedY;
      });

      if (particles.some(p => p.y < canvas.height)) {
        requestAnimationFrame(animateConfetti);
      } else {
        document.body.removeChild(canvas);
      }
    };

    animateConfetti();
  };

  return (
    <div className="text-center">
      <div className="glass-card" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#f1f5f9' }}>
          Quay Ngay Để Nhận Thưởng!
        </h2>

        {error ? (
          <div className="bg-red-900/50 border border-red-500 text-red-100 p-4 rounded mb-6">
            <p className="mb-2">{error}</p>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Thử lại
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="flex bg-slate-800 p-4 rounded-xl mb-6 items-center justify-center gap-4">
              <label style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>Số người trúng:</label>
              <input
                type="number"
                min="1"
                max="4"
                value={spinCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= 4) setSpinCount(val);
                }}
                disabled={spinning}
                className="input"
                style={{ 
                  width: '80px', 
                  fontSize: '1.2rem', 
                  textAlign: 'center',
                  background: '#334155',
                  border: '1px solid #475569'
                }}
              />
            </div>

            <canvas
              ref={canvasRef}
              width={650}
              height={650}
              style={{ maxWidth: '100%', height: 'auto' }}
            />

            <button
              className="btn btn-primary mt-8"
              onClick={handleSpin}
              disabled={spinning}
              style={{ fontSize: '1.2rem', padding: '16px 48px' }}
            >
              {spinning ? 'Đang Quay...' : '🎯 QUAY NGAY!'}
            </button>
          </>
        )}

        {/* Display Final Winners when Not Spinning */ }
        {!spinning && sessionWinners.length > 0 && (
          <div
            className="mt-8"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              padding: '30px',
              borderRadius: '16px',
              animation: 'pulse 2s infinite'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🎉 CHÚC MỪNG CÁC BẠN: 🎉</h3>
            <div className="flex flex-col gap-2">
              {sessionWinners.map((w, index) => (
                <div key={index} style={{ 
                  fontSize: sessionWinners.length > 1 ? '1.8rem' : '2.5rem', 
                  fontWeight: '800',
                  borderBottom: index < sessionWinners.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                  paddingBottom: index < sessionWinners.length - 1 ? '10px' : '0',
                  marginBottom: index < sessionWinners.length - 1 ? '10px' : '0'
                }}>
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display Temporary Winner During Multi-Spin */}
        {winner && spinning && (
           <div
           className="mt-8"
           style={{
             background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
             padding: '30px',
             borderRadius: '16px',
             animation: 'pulse 2s infinite'
           }}
         >
           <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🎉 CHÚC MỪNG! 🎉</h3>
           <p style={{ fontSize: '2rem', fontWeight: '800' }}>{winner.name}</p>
         </div>
        )}
        
        {sessionWinners.length > 0 && spinCount > 1 && (
          <div className="mt-8 text-left glass-card" style={{ padding: '20px', background: 'rgba(30, 41, 59, 0.7)' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#cbd5e1', borderBottom: '1px solid #475569', paddingBottom: '10px' }}>
              📜 Lịch sử quay lần này:
            </h4>
            <div className="flex flex-col gap-2">
              {sessionWinners.map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-slate-800/50">
                  <span style={{ 
                    background: '#6366f1', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>{i + 1}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{w.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LuckyWheel;
