import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Home, BarChart3, MapPin, MessageSquare, User, ArrowRight, Bell } from 'lucide-react';
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const { data } = await API.get('/properties/user/my-properties');
      setMyProperties(data.properties);
    } catch (error) {
      console.error("Error fetching properties", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/properties/${id}`);
          setMyProperties(myProperties.filter(p => p._id !== id));
          Swal.fire({ title: 'Deleted!', icon: 'success', background: '#0f172a', color: '#fff' });
        } catch (error) {
          Swal.fire({ title: 'Error!', text: 'Could not delete property', icon: 'error', background: '#0f172a' });
        }
      }
    });
  };

  if (loading) return <div style={styles.loading}><div className="loader"></div></div>;

  return (
    <div style={styles.container}>
      <style>{`
        .loader { border: 4px solid #1e293b; border-top: 4px solid #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .glass-card { 
          background: rgba(30, 41, 59, 0.4); 
          backdrop-filter: blur(10px); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          transition: all 0.3s ease; 
        }
        .glass-card:hover { 
          background: rgba(30, 41, 59, 0.6); 
          border: 1px solid rgba(59, 130, 246, 0.3); 
          transform: translateY(-5px); 
        }
      `}</style>

      {/* Hero Header Section */}
      <div style={styles.heroSection}>
        <div style={styles.welcomeInfo}>
          <h1 style={styles.title}>Welcome back, <span style={styles.gradientText}>{user?.name?.split(' ')[0]}!</span></h1>
          <p style={styles.subtitle}>Here's what's happening with your properties today.</p>
        </div>
        <div style={styles.quickActions}>
          <button onClick={() => navigate('/messages')} style={styles.iconBtn} title="Messages">
            <MessageSquare size={20} />
          </button>
          <button onClick={() => navigate('/add-property')} style={styles.primaryBtn}>
            <Plus size={20} /> List New Property
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={styles.topGrid}>
        {/* Profile Card - WITHOUT Settings */}
        <div className="glass-card" style={styles.profileSnapshot}>
          <div style={styles.avatarGlow}><User size={32} color="#3b82f6" /></div>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRoleBadge}>{user?.role?.toUpperCase()} ACCOUNT</div>
            <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>{user?.email}</div>
          </div>
        </div>
        
        <div className="glass-card" style={styles.statBox}>
          <div style={{...styles.iconCircle, backgroundColor: 'rgba(59, 130, 246, 0.1)'}}><Home color="#3b82f6" size={24} /></div>
          <div><div style={styles.statValue}>{myProperties.length}</div><div style={styles.statLabel}>Active Listings</div></div>
        </div>

        <div className="glass-card" style={styles.statBox}>
          <div style={{...styles.iconCircle, backgroundColor: 'rgba(16, 185, 129, 0.1)'}}><BarChart3 color="#10b981" size={24} /></div>
          <div><div style={styles.statValue}>{myProperties.reduce((acc, p) => acc + (p.views || 0), 0)}</div><div style={styles.statLabel}>User Views</div></div>
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.contentLayout}>
        <div style={styles.mainContent}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Listings</h2>
            <button onClick={() => navigate('/my-properties')} style={styles.linkBtn}>Manage All <ArrowRight size={16} /></button>
          </div>
          
          <div style={styles.cardGrid}>
            {myProperties.length > 0 ? myProperties.slice(0, 3).map((p) => (
              <div key={p._id} className="glass-card" style={styles.propertyCard}>
                <div style={styles.imageWrapper}>
                  <img src={p.images[0] ? `https://urbankey-backend.onrender.com/uploads/${p.images[0]}` : 'https://via.placeholder.com/400x250'} alt={p.title} style={styles.cardImg} />
                  <div style={{...styles.statusBadge, backgroundColor: p.status === 'approved' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)'}}>{p.status}</div>
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.propTitle}>{p.title}</h3>
                  <div style={styles.locationRow}><MapPin size={14} color="#64748b" /><span>{p.location?.city || 'Location N/A'}</span></div>
                  <div style={styles.cardFooter}>
                    <span style={styles.priceTag}>₹{(p.price / 100000).toFixed(2)} L</span>
                    <div style={styles.actionGroup}>
                        <button onClick={() => navigate(`/edit-property/${p._id}`)} style={styles.actionBtn}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={styles.emptyState}>
                <Home size={40} color="#334155" />
                <p>You haven't listed any properties yet.</p>
                <button onClick={() => navigate('/add-property')} style={styles.emptyBtn}>Start Listing</button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.sidebar}>
          <h2 style={styles.sectionTitle}>Quick Tips</h2>
          <div className="glass-card" style={styles.tipCard}>
             <Bell size={18} color="#f59e0b" /><p style={styles.tipText}>Respond to messages quickly to get higher ranking.</p>
          </div>
          <div className="glass-card" style={styles.tipCard}>
             <BarChart3 size={18} color="#3b82f6" /><p style={styles.tipText}>Properties with clear pricing sell 30% faster.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px 6%', backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc' },
  loading: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
  heroSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  title: { fontSize: '32px', fontWeight: '800' },
  gradientText: { background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#94a3b8', fontSize: '15px' },
  quickActions: { display: 'flex', gap: '12px' },
  primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' },
  iconBtn: { background: 'rgba(30, 41, 59, 0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', cursor: 'pointer' },
  topGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' },
  profileSnapshot: { padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '18px' },
  avatarGlow: { width: '56px', height: '56px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' },
  userName: { fontSize: '18px', fontWeight: '700' },
  userRoleBadge: { fontSize: '10px', color: '#3b82f6', fontWeight: '800', letterSpacing: '1px', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '3px 8px', borderRadius: '6px', marginTop: '4px', display: 'inline-block' },
  statBox: { padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px' },
  iconCircle: { width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: '26px', fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: '14px' },
  contentLayout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700' },
  linkBtn: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  propertyCard: { borderRadius: '20px', overflow: 'hidden' },
  imageWrapper: { position: 'relative', height: '180px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  statusBadge: { position: 'absolute', top: '12px', right: '12px', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#fff' },
  cardContent: { padding: '20px' },
  propTitle: { fontSize: '18px', fontWeight: '700' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', marginBottom: '20px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  priceTag: { fontSize: '20px', fontWeight: '800', color: '#3b82f6' },
  actionBtn: { background: 'rgba(245, 158, 11, 0.1)', border: 'none', color: '#f59e0b', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
  deleteBtn: { background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
  tipCard: { padding: '15px', borderRadius: '16px', display: 'flex', gap: '12px', marginBottom: '10px' },
  tipText: { fontSize: '13px', color: '#94a3b8' },
  emptyState: { gridColumn: '1/-1', padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(30, 41, 59, 0.2)', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.05)' },
  emptyBtn: { background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '10px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
};

export default UserDashboard;
