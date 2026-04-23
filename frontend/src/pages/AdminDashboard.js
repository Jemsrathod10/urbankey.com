import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, ShieldCheck, Trash2, LayoutDashboard, User, Mail, Phone, ExternalLink, AlertTriangle, X, Menu, LogOut, CheckCircle, Settings, Eye, EyeOff, UserCheck, Clock, Users, Send } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, inquiries: 0 });
  const [pendingProperties, setPendingProperties] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings & OTP States
  const [passwordData, setPasswordData] = useState({ email: '', password: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [confirmModal, setConfirmModal] = useState({ show: false, id: null, action: '', type: '' });

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sRes, pRes, uRes] = await Promise.all([
        API.get('/properties/stats').catch(() => ({ data: { users: 0, properties: 0, inquiries: 0 } })),
        API.get('/properties/pending').catch(() => ({ data: [] })),
        API.get('/auth/pending-users').catch(() => ({ data: { users: [] } }))
      ]);
      
      if (sRes.data) setStats(sRes.data);
      if (pRes.data) setPendingProperties(pRes.data);
      if (uRes.data && uRes.data.users) {
        setPendingUsers(uRes.data.users);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/properties/${id}/${action}`);
      setPendingProperties(pendingProperties.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, properties: action === 'approve' ? prev.properties + 1 : prev.properties }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserAction = async (id, action) => {
    try {
      if (action === 'approve') {
        await API.put(`/auth/approve-user/${id}`);
        setStats(prev => ({ ...prev, users: prev.users + 1 }));
      } else {
        await API.delete(`/auth/reject-user/${id}`);
      }
      setPendingUsers(pendingUsers.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const triggerConfirm = (id, action, type) => {
    setConfirmModal({ show: true, id, action, type });
  };

  const executeConfirmedAction = () => {
    if (confirmModal.type === 'property') {
      handleAction(confirmModal.id, confirmModal.action);
    } else {
      handleUserAction(confirmModal.id, confirmModal.action);
    }
    setConfirmModal({ show: false, id: null, action: '', type: '' });
  };

  // --- OTP & SETTINGS LOGIC ---
  const handleSendOTP = async () => {
    setOtpLoading(true);
    setMsg({ type: '', text: '' });
    try {
      // Current Admin na email par OTP mokalva mate
      await API.post('/auth/send-admin-otp'); 
      setOtpSent(true);
      setMsg({ type: 'success', text: 'OTP sent to your current registered email.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP. Ensure backend route exists.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    if (!passwordData.otp) {
      setMsg({ type: 'error', text: 'Please enter the OTP to proceed.' });
      return;
    }
    try {
      // OTP sathe email and password update karva mate
      await API.put('/auth/update-admin-secure', passwordData); 
      setMsg({ type: 'success', text: 'Security details updated successfully!' });
      setTimeout(() => { 
        setShowSettings(false); 
        setOtpSent(false);
        setMsg({ type: '', text: '' }); 
        setPasswordData({ email: '', password: '', otp: '' }); 
      }, 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Verification failed' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        .animate-pop { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* --- CONFIRMATION MODAL --- */}
      {confirmModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.premiumConfirmBox} className="animate-pop">
            <div style={{
              ...styles.iconWrapper, 
              backgroundColor: confirmModal.action === 'reject' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'
            }}>
              <AlertTriangle color={confirmModal.action === 'reject' ? '#ef4444' : '#10b981'} size={28} />
            </div>
            <h2 style={styles.modalHeading}>Are you sure?</h2>
            <p style={styles.modalSubheading}>
              You are about to <strong>{confirmModal.action}</strong> this {confirmModal.type}. 
              This process is permanent.
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setConfirmModal({ show: false, id: null, action: '', type: '' })} style={styles.cancelBtn}>No, Cancel</button>
              <button onClick={executeConfirmedAction} style={{...styles.confirmBtn, backgroundColor: confirmModal.action === 'reject' ? '#ef4444' : '#10b981'}}>
                Yes, {confirmModal.action.charAt(0).toUpperCase() + confirmModal.action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div style={styles.headerWrapper}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoOrb}><ShieldCheck color="#10b981" size={20} /></div>
            <span style={styles.brandText}>URBANKEY <span style={{color: '#10b981'}}>ADMIN</span></span>
          </div>
          <div style={styles.rightSection}>
            <nav className="desktop-nav" style={styles.nav}>
              <Link to="/admin-dashboard" style={styles.navActive}><LayoutDashboard size={16} /> <span>Dashboard</span></Link>
              <Link to="/admin-users" style={styles.navLink}><Users size={16} /> <span>Users</span></Link>
              <Link to="/admin-inquiries" style={styles.navLink}><MessageSquare size={16} /> <span>Inquiries</span></Link>
            </nav>
            <div style={styles.headerActions}>
              <button onClick={() => setShowSettings(true)} style={styles.settingsBtn} title="Settings"><Settings size={20} /></button>
              <button onClick={handleLogout} className="desktop-nav" style={styles.logoutBtn}>Logout</button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-toggle" style={styles.settingsBtn}>
                {isMenuOpen ? <X size={24} color="#10b981" /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link to="/admin-dashboard" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
            <Link to="/admin-users" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}><Users size={18} /> Users</Link>
            <Link to="/admin-inquiries" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}><MessageSquare size={18} /> Inquiries</Link>
            <button onClick={handleLogout} style={{...styles.mobileNavLink, color: '#ef4444', border: 'none', background: 'none', width: '100%', textAlign: 'left'}}><LogOut size={18} /> Logout</button>
          </div>
        )}
      </div>

      {/* --- SECURE SETTINGS MODAL WITH OTP --- */}
      {showSettings && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="animate-pop">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Security Settings</h3>
              <button onClick={() => { setShowSettings(false); setOtpSent(false); setMsg({type: '', text: ''}); }} style={styles.closeBtn}><X size={20} /></button>
            </div>
            
            {msg.text && (
              <div style={{
                ...styles.message, 
                color: msg.type === 'success' ? '#10b981' : '#ef4444',
                backgroundColor: msg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                {msg.text}
              </div>
            )}
            
            <form onSubmit={handleUpdateSecurity} style={{marginTop: '15px'}}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Email Address</label>
                <input 
                  type="email" 
                  style={styles.input} 
                  placeholder="Enter new email" 
                  value={passwordData.email} 
                  onChange={(e) => setPasswordData({...passwordData, email: e.target.value})} 
                  disabled={otpSent} 
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    style={styles.inputWithIcon} 
                    placeholder="New password" 
                    value={passwordData.password} 
                    onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} 
                    disabled={otpSent} 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!otpSent ? (
                <button type="button" onClick={handleSendOTP} style={styles.submitBtn} disabled={otpLoading}>
                  {otpLoading ? 'Sending OTP...' : 'Send OTP to Verify'}
                </button>
              ) : (
                <div className="animate-pop" style={{borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', paddingTop: '20px'}}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Verification OTP</label>
                    <input 
                      type="text" 
                      style={{...styles.input, borderColor: '#10b981'}} 
                      placeholder="Enter 6-digit OTP" 
                      value={passwordData.otp} 
                      onChange={(e) => setPasswordData({...passwordData, otp: e.target.value})} 
                    />
                  </div>
                  <button type="submit" style={{...styles.submitBtn, backgroundColor: '#10b981'}}>Confirm Changes</button>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)} 
                    style={{background: 'none', border: 'none', color: '#64748b', width: '100%', marginTop: '10px', fontSize: '12px', cursor: 'pointer'}}
                  >
                    Edit Details
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main style={styles.main}>
        <div style={{maxWidth: '1300px', margin: '0 auto', padding: '0 20px'}}>
          <div style={styles.heroSection}>
            <h1 style={styles.pageTitle}>System Overview</h1>
            <p style={styles.pageSub}>Monitor portal activity and manage pending approvals.</p>
          </div>

          <div style={styles.statsGrid}>
            {[
              { label: 'Total Users', value: stats.users, icon: <User color="#3b82f6"/>, bg: 'rgba(59, 130, 246, 0.1)' },
              { label: 'Live Listings', value: stats.properties, icon: <ShieldCheck color="#10b981"/>, bg: 'rgba(16, 185, 129, 0.1)' },
              { label: 'Active Leads', value: stats.inquiries, icon: <MessageSquare color="#f59e0b"/>, bg: 'rgba(245, 158, 11, 0.1)' }
            ].map((s, i) => (
              <div key={i} style={styles.statCard}>
                <div style={{...styles.iconBox, backgroundColor: s.bg}}>{s.icon}</div>
                <div style={styles.statInfo}><span style={styles.statLabel}>{s.label}</span><span style={styles.statValue}>{loading ? '...' : s.value}</span></div>
              </div>
            ))}
          </div>

          <div style={styles.contentGrid}>
            <div style={styles.panel}>
              <div style={styles.panelHead}><h2 style={styles.panelTitle}>Pending Registrations</h2><span style={{...styles.badge, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>{pendingUsers.length} Requests</span></div>
              <div style={styles.list}>
                {loading ? [1,2].map(i => <div key={i} style={styles.skeletonCard}></div>) : pendingUsers.length === 0 ? <div style={styles.empty}>No pending user requests.</div> : pendingUsers.map(user => (
                    <div key={user._id} style={styles.item}>
                      <div style={styles.itemMeta}><div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={styles.mainTxt}>{user.name}</span><span style={{fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#1e293b', color: '#94a3b8', textTransform: 'uppercase'}}>{user.role}</span></div><span style={styles.subTxt}>{user.email} • {user.phone}</span></div>
                      <div style={styles.btnGroup}>
                        <button onClick={() => triggerConfirm(user._id, 'approve', 'user')} style={styles.approveBtn} title="Approve"><UserCheck size={18} /></button>
                        <button onClick={() => triggerConfirm(user._id, 'reject', 'user')} style={styles.rejectBtn} title="Reject"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHead}><h2 style={styles.panelTitle}>Property Approvals</h2><span style={styles.badge}>{pendingProperties.length} Awaiting</span></div>
              <div style={styles.list}>
                {loading ? [1,2].map(i => <div key={i} style={styles.skeletonCard}></div>) : pendingProperties.length === 0 ? <div style={styles.empty}>All properties are currently live.</div> : pendingProperties.map(p => (
                    <div key={p._id} style={styles.item}>
                      <div style={styles.itemMeta}><span style={styles.mainTxt}>{p.title}</span><span style={styles.subTxt}>{p.location?.city || 'No Location'} • ₹{p.price}</span></div>
                      <div style={styles.btnGroup}>
                        <button onClick={() => triggerConfirm(p._id, 'approve', 'property')} style={styles.approveBtn} title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => triggerConfirm(p._id, 'reject', 'property')} style={styles.rejectBtn} title="Reject"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}><span>UrbanKey Real Estate ● Admin Terminal</span><span style={{color: '#475569'}}>v2.0.4 SECURE</span></div>
      </footer>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#090b0f', color: '#e2e8f0', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" },
  headerWrapper: { position: 'sticky', top: '15px', zIndex: 1000, width: '100%', padding: '0 15px', boxSizing: 'border-box' },
  header: { maxWidth: '1300px', margin: '0 auto', height: '65px', backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(15px)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoOrb: { padding: '7px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' },
  brandText: { fontWeight: '700', letterSpacing: '0.5px' },
  rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  nav: { display: 'flex', gap: '8px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' },
  navLink: { color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: '600', padding: '7px 14px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '8px' },
  navActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', textDecoration: 'none', fontSize: '13px', fontWeight: '700', padding: '7px 14px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '15px' },
  settingsBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.3s' },
  logoutBtn: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '7px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
  main: { flex: 1, marginTop: '40px', width: '100%' },
  heroSection: { marginBottom: '35px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '6px' },
  pageSub: { color: '#64748b', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '35px' },
  statCard: { backgroundColor: '#111827', padding: '22px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '18px' },
  iconBox: { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statInfo: { display: 'flex', flexDirection: 'column' },
  statLabel: { fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#f8fafc' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' },
  panel: { backgroundColor: '#111827', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' },
  panelHead: { padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  panelTitle: { fontSize: '14px', fontWeight: '700', color: '#cbd5e1' },
  badge: { fontSize: '10px', fontWeight: '800', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 9px', borderRadius: '7px' },
  list: { padding: '10px 22px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' },
  itemMeta: { display: 'flex', flexDirection: 'column' },
  mainTxt: { fontWeight: '600', fontSize: '14px', color: '#f1f5f9' },
  subTxt: { fontSize: '12px', color: '#475569' },
  btnGroup: { display: 'flex', gap: '8px' },
  approveBtn: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '7px', borderRadius: '8px', cursor: 'pointer' },
  rejectBtn: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '7px', borderRadius: '8px', cursor: 'pointer' },
  empty: { padding: '40px 0', textAlign: 'center', color: '#334155', fontSize: '13px' },
  footer: { padding: '30px', borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '40px' },
  footerInner: { maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', fontWeight: '600' },
  mobileMenu: { position: 'absolute', top: '75px', left: '15px', right: '15px', backgroundColor: '#111827', borderRadius: '16px', padding: '15px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1001 },
  mobileNavLink: { color: '#f8fafc', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: '#111827', borderRadius: '24px', padding: '32px', width: '90%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.05)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  modalTitle: { fontSize: '18px', fontWeight: '800' },
  closeBtn: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer' },
  inputGroup: { marginBottom: '18px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', display: 'block' },
  input: { width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 15px', color: '#fff', boxSizing: 'border-box', outline: 'none' },
  passwordWrapper: { position: 'relative' },
  inputWithIcon: { width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 45px 12px 15px', color: '#fff', boxSizing: 'border-box', outline: 'none' },
  eyeIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  submitBtn: { width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
  message: { fontSize: '12px', textAlign: 'center', marginBottom: '15px' },
  skeletonCard: { backgroundColor: '#1e293b', height: '60px', borderRadius: '12px', marginBottom: '10px', width: '100%' },
  premiumConfirmBox: { backgroundColor: '#111827', width: '95%', maxWidth: '400px', borderRadius: '32px', padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)' },
  iconWrapper: { width: '70px', height: '70px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' },
  modalHeading: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  modalSubheading: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' },
  confirmBtn: { flex: 1, color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' }
};

export default AdminDashboard;