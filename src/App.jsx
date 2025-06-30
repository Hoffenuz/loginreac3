import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './login';
import './index.css';

const SUPABASE_URL = 'https://fbpaezxcpykwdfowypqw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicGFlenhjcHlrd2Rmb3d5cHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTY0NTYsImV4cCI6MjA2MzY3MjQ1Nn0.aFeFK0jvaDoQbPyA2a3qFQu0KFEp4hGPU39n6z8Hhsk';

function randomAvatar(id) {
  // 1-70 oralig'ida random avatar
  return `https://i.pravatar.cc/150?img=${(id % 70) + 1}`;
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  async function fetchAloqa() {
    try {
      setLoading(true);
      // Aloqa endpointini to'g'ri yo'naltirish
      const res = await fetch(`${SUPABASE_URL}/rest/v1/aloqa?select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (!res.ok) throw new Error('Maʼlumotlarni olishda xatolik');
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAloqa();
    const interval = setInterval(fetchAloqa, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    // For demo: old password is 'u1121', change it in-memory only
    const currentPassword = localStorage.getItem('admin-password') || 'u1121';
    if (oldPassword !== currentPassword) {
      setPasswordError("Eski parol noto'g'ri");
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError("Yangi parol kamida 5 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yangi parollar mos emas");
      return;
    }
    localStorage.setItem('admin-password', newPassword);
    setPasswordSuccess("Parol muvaffaqiyatli o'zgartirildi!");
    setTimeout(() => {
      setShowPasswordModal(false);
      setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); setPasswordSuccess("");
    }, 1200);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="navbar">
        <div className="logo">Admin Panel</div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowPasswordModal(true)} className="btn btn-primary" style={{marginRight:8}}>Parolni o'zgartirish</button>
          <button onClick={handleLogout} className="btn btn-danger">Chiqish</button>
        </div>
      </div>
      {/* Modal for password change */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Parolni o'zgartirish</h2>
            <form onSubmit={handlePasswordChange}>
              <label className="form-label">Eski parol</label>
              <input type="password" className="form-control" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required />
              <label className="form-label" style={{marginTop:12}}>Yangi parol</label>
              <input type="password" className="form-control" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
              <label className="form-label" style={{marginTop:12}}>Yangi parolni tasdiqlang</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
              {passwordError && <div className="alert alert-danger" style={{marginTop:10}}>{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success" style={{marginTop:10}}>{passwordSuccess}</div>}
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:18}}>
                <button type="button" className="btn btn-secondary" onClick={()=>setShowPasswordModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-success">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMsgModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Xabar</h2>
            <div style={{whiteSpace:'pre-wrap', color:'#333', fontSize:16, margin:'18px 0'}}>{modalMsg}</div>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setShowMsgModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
      <h1 style={{ textAlign: 'center', color: '#2e7d32', margin: '30px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        Aloqa xabarlari
        {loading && <span className="heading-spinner" />}
      </h1>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div style={{ maxWidth: 1100, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, justifyContent: 'center' }}>
              <div style={{width: '100%', overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(46,125,50,0.08)'}}>
                  <thead>
                    <tr style={{background: '#e8f5e9'}}>
                      <th style={{padding: '12px 8px'}}>Foydalanuvchi</th>
                      <th style={{padding: '12px 8px'}}>Email</th>
                      <th style={{padding: '12px 8px'}}>Xabar</th>
                      <th style={{padding: '12px 8px'}}>Vaqt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{textAlign:'center', color:'#888', padding:'24px 0'}}>Xabarlar mavjud emas</td>
                      </tr>
                    ) : (
                      messages.map((msg) => (
                        <tr key={msg.id} style={{borderBottom: '1px solid #eee'}}>
                          <td style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px'}}>
                            <img src="/user.svg" alt="user" style={{width: 40, height: 40, borderRadius: '50%', background: '#e0e0e0', border: '1px solid #bbb', objectFit: 'cover'}} />
                            <span style={{fontWeight: 600, color: '#2e7d32', fontSize: 16}}>{msg.ism}</span>
                          </td>
                          <td style={{color: '#555', fontSize: 15, padding: '10px 8px'}}>{msg.email}</td>
                          <td style={{color: '#333', fontSize: 15, padding: '10px 8px', cursor:'pointer'}}
                            onClick={()=>{setModalMsg(msg.xabar);setShowMsgModal(true);}}>
                            {msg.xabar && msg.xabar.length > 30 ? (
                              <span title="To‘liq ko‘rish">{msg.xabar.slice(0,30)}...</span>
                            ) : (
                              msg.xabar
                            )}
                          </td>
                          <td style={{color: '#888', fontSize: 14, padding: '10px 8px'}}>{new Date(msg.created_at).toLocaleString('uz-UZ')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer style={{background: '#2e7d32', color: 'white', textAlign: 'center', padding: '16px 0', marginTop: 40}}>
        &copy; {new Date().getFullYear()} Real Admin Panel. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
}

function HotelDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function fetchBurron() {
    try {
      setLoading(true);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/burron?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (!res.ok) throw new Error('Maʼlumotlarni olishda xatolik');
      const data = await res.json();
      setRooms(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBurron();
    const interval = setInterval(fetchBurron, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    const currentPassword = localStorage.getItem('admin-password') || 'u1121';
    if (oldPassword !== currentPassword) {
      setPasswordError("Eski parol noto'g'ri");
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError("Yangi parol kamida 5 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Yangi parollar mos emas");
      return;
    }
    localStorage.setItem('admin-password', newPassword);
    setPasswordSuccess("Parol muvaffaqiyatli o'zgartirildi!");
    setTimeout(() => {
      setShowPasswordModal(false);
      setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); setPasswordSuccess("");
    }, 1200);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="navbar">
        <div className="logo">Hotel Panel</div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setShowPasswordModal(true)} className="btn btn-primary" style={{marginRight:8}}>Parolni o'zgartirish</button>
          <button onClick={handleLogout} className="btn btn-danger">Chiqish</button>
        </div>
      </div>
      {/* Modal for password change */}
      {showPasswordModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Parolni o'zgartirish</h2>
            <form onSubmit={handlePasswordChange}>
              <label className="form-label">Eski parol</label>
              <input type="password" className="form-control" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required />
              <label className="form-label" style={{marginTop:12}}>Yangi parol</label>
              <input type="password" className="form-control" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
              <label className="form-label" style={{marginTop:12}}>Yangi parolni tasdiqlang</label>
              <input type="password" className="form-control" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
              {passwordError && <div className="alert alert-danger" style={{marginTop:10}}>{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success" style={{marginTop:10}}>{passwordSuccess}</div>}
              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:18}}>
                <button type="button" className="btn btn-secondary" onClick={()=>setShowPasswordModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-success">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMsgModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Qo'shimcha ma'lumot</h2>
            <div style={{whiteSpace:'pre-wrap', color:'#333', fontSize:16, margin:'18px 0'}}>{modalMsg}</div>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setShowMsgModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
      <h1 style={{ textAlign: 'center', color: '#2e7d32', margin: '30px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        Hotel so'rovlari
        {loading && <span className="heading-spinner" />}
      </h1>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div style={{ maxWidth: 1100, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, justifyContent: 'center' }}>
              <div style={{width: '100%', overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(46,125,50,0.08)'}}>
                  <thead>
                    <tr style={{background: '#e8f5e9'}}>
                      <th style={{padding: '12px 8px'}}>Ism</th>
                      <th style={{padding: '12px 8px'}}>Familiya</th>
                      <th style={{padding: '12px 8px'}}>Telefon</th>
                      <th style={{padding: '12px 8px'}}>Xona turi/narxi</th>
                      <th style={{padding: '12px 8px'}}>Qo'shimcha ma'lumot</th>
                      <th style={{padding: '12px 8px'}}>Vaqt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{textAlign:'center', color:'#888', padding:'24px 0'}}>So'rovlar mavjud emas</td>
                      </tr>
                    ) : (
                      rooms.map((room) => (
                        <tr key={room.id} style={{borderBottom: '1px solid #eee'}}>
                          <td style={{fontWeight: 600, color: '#2e7d32', fontSize: 16, padding: '10px 8px'}}>{room.ism}</td>
                          <td style={{color: '#555', fontSize: 15, padding: '10px 8px'}}>{room.familya}</td>
                          <td style={{color: '#555', fontSize: 15, padding: '10px 8px'}}>{room.telefon}</td>
                          <td style={{color: '#333', fontSize: 15, padding: '10px 8px'}}>{room.xona_turi_narxi}</td>
                          <td style={{color: '#333', fontSize: 15, padding: '10px 8px', cursor:'pointer'}} onClick={()=>{setModalMsg(room.qoshimcha_malumot);setShowMsgModal(true);}}>
                            {room.qoshimcha_malumot && room.qoshimcha_malumot.length > 30 ? (
                              <span title="To‘liq ko‘rish">{room.qoshimcha_malumot.slice(0,30)}...</span>
                            ) : (
                              room.qoshimcha_malumot
                            )}
                          </td>
                          <td style={{color: '#888', fontSize: 14, padding: '10px 8px'}}>{room.created_at ? new Date(room.created_at).toLocaleString('uz-UZ') : ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer style={{background: '#2e7d32', color: 'white', textAlign: 'center', padding: '16px 0', marginTop: 40}}>
        &copy; {new Date().getFullYear()} Real Admin Panel. Barcha huquqlar himoyalangan.
      </footer>
    </div>
  );
}

function SelectPanel() {
  const navigate = useNavigate();
  return (
    <div className="container" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="card shadow-lg" style={{minWidth:340,padding:32}}>
        <h2 style={{textAlign:'center',marginBottom:24}}>Bo'limni tanlang</h2>
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <button className="btn btn-primary" style={{fontSize:18}} onClick={()=>navigate('/aloqa')}>Avtotest</button>
          <button className="btn btn-success" style={{fontSize:18}} onClick={()=>navigate('/hotel')}>Hotel</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/select" element={<ProtectedRoute><SelectPanel /></ProtectedRoute>} />
        <Route
          path="/aloqa"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel"
          element={
            <ProtectedRoute>
              <HotelDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/aloqa" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
