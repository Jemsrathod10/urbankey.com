import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, ShieldCheck, Trash2, LayoutDashboard, User, Mail, Phone, ExternalLink, AlertTriangle, X, Menu, LogOut, Users } from 'lucide-react';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await API.get('/inquiries/all');
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) { setInquiries([]); }
    finally { setLoading(false); }
  };

  const deleteInquiry = async () => {
    if (!selectedId) return;
    try {
      await API.delete(`/inquiries/${selectedId}`);
      setInquiries(inquiries.filter(item => item._id !== selectedId));
      setShowConfirm(false);
      setSelectedId(null);
    } catch (err) { console.error(err); }
  };

  const openConfirm = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) return <div style={styles.loaderContainer}><div style={styles.loader}></div></div>;

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
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.warningIcon}><AlertTriangle size={24} color="#ef4444" /></div>
              <button onClick={() => setShowConfirm(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <h3 style={styles.modalTitle}>Confirm Deletion</h3>
            <p style={styles.modalText}>Are you sure you want to remove this lead? This action cannot be undone.</p>
            <div style={styles.modalActions}>
              <button onClick={() => setShowConfirm(false)} style={styles.cancelBtn}>Keep Lead</button>
              <button onClick={deleteInquiry} style={styles.confirmBtn}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.headerWrapper}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoOrb}><ShieldCheck color="#10b981" size={20} /></div>
            <span style={styles.brandText}>URBANKEY <span style={{color: '#10b981'}}>ADMIN</span></span>
          </div>

          <div style={styles.rightSection}>
            <nav className="desktop-nav" style={styles.nav}>
              <Link to="/admin-dashboard" style={styles.navLink}>
                <LayoutDashboard size={16} /> <span>Dashboard</span>
              </Link>
              {/* Added User Link */}
              <Link to="/admin-users" style={styles.navLink}>
                <Users size={16} /> <span>Users</span>
              </Link>
              <Link to="/admin-inquiries" style={styles.navActive}>
                <MessageSquare size={16} /> <span>Inquiries</span>
              </Link>
            </nav>

            <div style={styles.headerActions}>
              <button onClick={handleLogout} className="desktop-nav" style={styles.logoutBtn}>Logout</button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-toggle" style={styles.settingsBtn}>
                {isMenuOpen ? <X size={24} color="#10b981" /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link to="/admin-dashboard" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            {/* Added User Link Mobile */}
            <Link to="/admin-users" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              <Users size={18} /> Users
            </Link>
            <Link to="/admin-inquiries" style={{...styles.mobileNavLink, color: '#10b981'}} onClick={() => setIsMenuOpen(false)}>
              <MessageSquare size={18} /> Inquiries
            </Link>
            <button onClick={handleLogout} style={{...styles.mobileNavLink, color: '#ef4444', border: 'none', background: 'none', width: '100%', textAlign: 'left'}}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>

      <main style={styles.main}>
        <div style={{maxWidth: '1300px', margin: '0 auto', padding: '0 20px'}}>
          <div style={styles.heroSection}>
            <h1 style={styles.pageTitle}>Inquiry Pipeline</h1>
            <p style={styles.pageSub}>High-priority leads and visitor messages from the portal.</p>
          </div>
          
          <div style={styles.inquiryGrid}>
            {inquiries.length === 0 ? <div style={styles.emptyFull}>No active leads found.</div> : 
              inquiries.map(item => (
                <div key={item._id} style={styles.inquiryCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.userSection}>
                      <div style={styles.avatar}><User size={20} color="#10b981"/></div>
                      <div>
                        <div style={styles.uName}>{item.name}</div>
                        <div style={styles.uDate}>{new Date(item.createdAt).toDateString()}</div>
                      </div>
                    </div>
                    <button onClick={() => openConfirm(item._id)} style={styles.delBtn}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  
                  <div style={styles.contactDetails}>
                    <div style={styles.contactItem}>
                      <div style={styles.iconCircle}><Mail size={14} color="#10b981"/></div>
                      <span style={styles.contactText}>{item.email}</span>
                    </div>
                    <div style={styles.contactItem}>
                      <div style={styles.iconCircle}><Phone size={14} color="#10b981"/></div>
                      <span style={styles.contactText}>{item.phone}</span>
                    </div>
                  </div>

                  <div style={styles.messageContainer}>
                    <div style={styles.msgLabel}>MESSAGE CONTENT</div>
                    <div style={styles.msgContent}>{item.message}</div>
                  </div>

                  <a href={`https://wa.me/${item.phone}`} target="_blank" rel="noreferrer" style={styles.whatsappBtn}>
                    Respond on WhatsApp <ExternalLink size={14}/>
                  </a>
                </div>
              ))
            }
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span>UrbanKey Real Estate ● Admin Terminal</span>
          <span style={{color: '#475569'}}>v2.0.4 SECURE</span>
        </div>
      </footer>
    </div>
  );
};

// Styles remain exactly as provided in the previous Inquiries code
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#090b0f', color: '#e2e8f0', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" },
  loaderContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#090b0f' },
  loader: { width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' },
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
  settingsBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  logoutBtn: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '7px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  main: { flex: 1, marginTop: '40px', width: '100%' },
  heroSection: { marginBottom: '35px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '6px' },
  pageSub: { color: '#64748b', fontSize: '14px' },
  inquiryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '25px' },
  inquiryCard: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', padding: '22px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  userSection: { display: 'flex', gap: '12px', alignItems: 'center' },
  avatar: { width: '42px', height: '42px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uName: { fontWeight: '800', fontSize: '16px', color: '#fff' },
  uDate: { fontSize: '11px', color: '#475569' },
  delBtn: { backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
  contactDetails: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconCircle: { width: '28px', height: '28px', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  contactText: { fontSize: '13px', color: '#94a3b8' },
  messageContainer: { backgroundColor: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.02)' },
  msgLabel: { color: '#334155', fontSize: '9px', fontWeight: '900', marginBottom: '8px', letterSpacing: '0.5px' },
  msgContent: { fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' },
  whatsappBtn: { backgroundColor: '#10b981', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', transition: '0.3s' },
  footer: { padding: '30px', borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '40px' },
  footerInner: { maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', fontWeight: '600' },
  emptyFull: { gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#334155', fontSize: '14px' },
  mobileMenu: { position: 'absolute', top: '75px', left: '15px', right: '15px', backgroundColor: '#111827', borderRadius: '16px', padding: '15px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 1001 },
  mobileNavLink: { color: '#f8fafc', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { backgroundColor: '#111827', borderRadius: '28px', padding: '32px', maxWidth: '400px', width: '100%', border: '1px solid rgba(255,255,255,0.05)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  warningIcon: { padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '14px' },
  closeBtn: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer' },
  modalTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '8px' },
  modalText: { fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.5' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '14px', cursor: 'pointer', fontWeight: '600' },
  confirmBtn: { flex: 1, backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', cursor: 'pointer', fontWeight: '700' }
};

export default AdminInquiries;