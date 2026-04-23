import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, User, Mail, ShieldCheck, Search, LayoutDashboard, MessageSquare, Menu, X, LogOut, Users, Phone, Calendar, Key } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/auth/all-users'); 
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.put(`/auth/update-role/${id}`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      Swal.fire({ title: 'Success!', text: 'Role updated.', icon: 'success', background: '#111827', color: '#fff', confirmButtonColor: '#10b981' });
    } catch (error) {
      Swal.fire({ title: 'Error!', text: 'Action failed', icon: 'error', background: '#111827', color: '#fff' });
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: 'Delete User?',
      text: "This user will be permanently removed!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete',
      background: '#111827',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/auth/delete-user/${id}`);
          setUsers(users.filter(u => u._id !== id));
          Swal.fire({ title: 'Deleted!', icon: 'success', background: '#111827', color: '#fff' });
        } catch (error) {
          Swal.fire({ title: 'Error!', text: 'Delete failed', icon: 'error' });
        }
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.loaderContainer}><div style={styles.loader}></div></div>;

  return (
    <div style={styles.container}>
      <style>{`
        @media (max-width: 1024px) { 
          .desktop-nav { display: none !important; } 
          .mobile-toggle { display: flex !important; } 
          .page-title { font-size: 22px !important; }
        }
        @media (min-width: 1025px) { 
          .desktop-nav { display: flex !important; } 
          .mobile-toggle { display: none !important; } 
        }
        @media (max-width: 768px) {
          .action-bar { flex-direction: column !important; align-items: stretch !important; }
          .search-wrapper { max-width: 100% !important; }
          .stat-mini { justify-content: center !important; display: flex; }
          .main-content { padding: 0 10px !important; }
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .user-row:hover { background: rgba(255,255,255,0.02) !important; }
        
        select option {
          background-color: #111827 !important;
          color: #ffffff !important;
          padding: 10px;
        }

        /* Horizontal Scroll for Table on Small Screens */
        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .table-responsive::-webkit-scrollbar {
          height: 4px;
        }
        .table-responsive::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
      `}</style>

      {/* HEADER */}
      <div style={styles.headerWrapper}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoOrb}><ShieldCheck color="#10b981" size={20} /></div>
            <span style={styles.brandText}>URBANKEY <span style={{color: '#10b981'}}>ADMIN</span></span>
          </div>
          <div style={styles.rightSection}>
            <nav className="desktop-nav" style={styles.nav}>
              <Link to="/admin-dashboard" style={styles.navLink}><LayoutDashboard size={16} /> <span>Dashboard</span></Link>
              <Link to="/admin-users" style={styles.navActive}><Users size={16} /> <span>Users</span></Link>
              <Link to="/admin-inquiries" style={styles.navLink}><MessageSquare size={16} /> <span>Inquiries</span></Link>
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
            <Link to="/admin-dashboard" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
            <Link to="/admin-users" style={{...styles.mobileNavLink, color: '#10b981'}} onClick={() => setIsMenuOpen(false)}><Users size={18} /> Users</Link>
            <Link to="/admin-inquiries" style={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}><MessageSquare size={18} /> Inquiries</Link>
            <button onClick={handleLogout} style={{...styles.mobileNavLink, color: '#ef4444', border: 'none', background: 'none', width: '100%', textAlign: 'left'}}><LogOut size={18} /> Logout</button>
          </div>
        )}
      </div>

      <main style={styles.main} className="main-content">
        <div style={{maxWidth: '1300px', margin: '0 auto', padding: '0 15px'}}>
          <div style={styles.heroSection}>
            <h1 style={styles.pageTitle} className="page-title">User Control Center</h1>
            <p style={styles.pageSub}>Manage user accounts, roles, and administrative access.</p>
          </div>

          <div style={styles.actionBar} className="action-bar">
             <div style={styles.searchWrapper} className="search-wrapper">
                <Search size={18} color="#64748b" style={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  style={styles.searchInput}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div style={styles.statMini} className="stat-mini">
                <span style={styles.statLabel}>System Users:</span>
                <span style={styles.statValue}>{users.length}</span>
             </div>
          </div>

          <div style={styles.tablePanel}>
            <div className="table-responsive">
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>USER IDENTITY</th>
                    <th style={styles.th}>CONTACT INFO</th>
                    <th style={styles.th}>ACCOUNT ROLE</th>
                    <th style={styles.th}>REGISTRATION</th>
                    <th style={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" style={styles.emptyRow}>No matching users found.</td></tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u._id} className="user-row" style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.userInfo}>
                            <div style={styles.avatarBox}>{u.name.charAt(0)}</div>
                            <span style={styles.userName}>{u.name}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.contactCell}><Mail size={14} color="#64748b"/> {u.email}</div>
                          {u.phone && <div style={styles.contactCell}><Phone size={14} color="#64748b"/> {u.phone}</div>}
                        </td>
                        <td style={styles.td}>
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            style={{
                              ...styles.roleSelect,
                              color: u.role === 'owner' ? '#f59e0b' : u.role === 'agent' ? '#10b981' : '#3b82f6',
                              borderColor: u.role === 'owner' ? 'rgba(245, 158, 11, 0.4)' : u.role === 'agent' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'
                            }}
                          >
                            <option value="customer">Customer</option>
                            <option value="agent">Agent</option>
                            <option value="owner">Owner</option>
                            {u.role === 'admin' && <option value="admin">Admin</option>}
                          </select>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.dateCell}><Calendar size={14}/> {new Date(u.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => handleDeleteUser(u._id)} style={styles.deleteBtn} title="Remove User">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span>UrbanKey Real Estate ● Admin Terminal</span>
          <span style={{color: '#475569'}} className="desktop-nav">v2.0.4 SECURE</span>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#090b0f', color: '#e2e8f0', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" },
  loaderContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#090b0f' },
  loader: { width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.1)', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  headerWrapper: { position: 'sticky', top: '0', zIndex: 1000, width: '100%', padding: '10px 0' },
  header: { maxWidth: '1300px', margin: '0 auto', height: '65px', backgroundColor: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(15px)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', width: '95%' },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoOrb: { padding: '7px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' },
  brandText: { fontWeight: '700', letterSpacing: '0.5px', fontSize: '14px' },
  rightSection: { display: 'flex', alignItems: 'center', gap: '15px' },
  nav: { display: 'flex', gap: '5px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px' },
  navLink: { color: '#64748b', textDecoration: 'none', fontSize: '12px', fontWeight: '600', padding: '7px 12px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '6px' },
  navActive: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', textDecoration: 'none', fontSize: '12px', fontWeight: '700', padding: '7px 12px', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' },
  logoutBtn: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '7px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },
  main: { flex: 1, marginTop: '20px', width: '100%' },
  heroSection: { marginBottom: '25px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', marginBottom: '6px' },
  pageSub: { color: '#64748b', fontSize: '13px' },
  actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px' },
  searchWrapper: { position: 'relative', flex: 1, maxWidth: '400px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' },
  searchInput: { width: '100%', padding: '12px 12px 12px 42px', backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  statMini: { backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' },
  statLabel: { fontSize: '12px', color: '#64748b', marginRight: '8px', fontWeight: '600' },
  statValue: { fontWeight: '800', color: '#10b981' },
  tablePanel: { backgroundColor: '#111827', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' },
  tableHead: { borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: 'rgba(255,255,255,0.01)' },
  th: { padding: '18px 20px', fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.02)' },
  td: { padding: '15px 20px', fontSize: '14px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarBox: { width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' },
  userName: { fontWeight: '700', color: '#f1f5f9' },
  contactCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', marginBottom: '4px' },
  roleSelect: { backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid', padding: '6px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', outline: 'none' },
  dateCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '12px' },
  deleteBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: '0.8', transition: '0.2s' },
  emptyRow: { padding: '50px', textAlign: 'center', color: '#334155' },
  footer: { padding: '20px 30px', borderTop: '1px solid rgba(255,255,255,0.03)', marginTop: '30px' },
  footerInner: { maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', fontWeight: '600' },
  mobileMenu: { position: 'absolute', top: '80px', left: '5%', right: '5%', backgroundColor: '#111827', borderRadius: '16px', padding: '15px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1001, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
  mobileNavLink: { color: '#f8fafc', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  settingsBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }
};

export default AdminUserManagement;