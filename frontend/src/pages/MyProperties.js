import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Eye, Clock, Check, X, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const { data } = await API.get('/properties/user/my-properties');
      setProperties(data.properties);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#151a35',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/properties/${id}`);
        setProperties(properties.filter(p => p._id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your property has been deleted.',
          icon: 'success',
          background: '#151a35',
          color: '#fff',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete property.',
          background: '#151a35',
          color: '#fff'
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: '#f59e0b', icon: Clock, label: 'Pending Approval' },
      approved: { bg: '#10b981', icon: Check, label: 'Live' },
      rejected: { bg: '#ef4444', icon: X, label: 'Rejected' }
    };
    const current = statusStyles[status] || statusStyles.pending;
    const StatusIcon = current.icon;

    return (
      <span style={{...styles.badgeBase, backgroundColor: current.bg}}>
        <StatusIcon size={14} /> {current.label}
      </span>
    );
  };

  if (loading) return <div style={styles.loading}><div className="spinner"></div><p>Loading your dashboard...</p></div>;

  return (
    <div style={styles.container}>
      <style>{`
        .property-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .property-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 30px -10px rgba(59, 130, 246, 0.3);
          border-color: #3b82f6 !important;
        }
        .add-btn-hover:hover {
          filter: brightness(1.1);
          transform: scale(1.02);
        }
      `}</style>
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Properties</h1>
            <p style={styles.subtitle}>You have {properties.length} listings in your account</p>
          </div>
          <Link to="/add-property" className="add-btn-hover" style={styles.addBtn}>
            <Plus size={20} /> Add New Listing
          </Link>
        </div>

        {properties.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}><Plus size={40} /></div>
            <h3 style={styles.emptyTitle}>You haven't listed any properties yet</h3>
            <p style={styles.emptyText}>Reach thousands of buyers by listing your property today.</p>
            <Link to="/add-property" style={styles.addBtn}>Start Listing</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {properties.map(property => {
              const imageUrl = property.images && property.images.length > 0 
                ? `https://urbankey-com.onrender.com/uploads/${property.images[0]}` 
                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';

              return (
                <div key={property._id} className="property-card" style={styles.card}>
                  <div style={styles.imageContainer}>
                    <img src={imageUrl} alt={property.title} style={styles.image} />
                    <div style={styles.imageOverlay}></div>
                    {getStatusBadge(property.status)}
                  </div>

                  <div style={styles.content}>
                    <div style={styles.typeTag}>{property.propertyType}</div>
                    <h3 style={styles.propertyTitle}>{property.title}</h3>
                    <div style={styles.location}><MapPin size={14} color="#3b82f6" /> {property.location.city}</div>
                    
                    <div style={styles.priceRow}>
                        <div style={styles.priceText}>₹ {(property.price / 100000).toFixed(2)} Lakh</div>
                        <div style={styles.purposeTag}>{property.purpose}</div>
                    </div>
                    
                    <div style={styles.statsRow}>
                      <div style={styles.stat}><Eye size={16} /> <span>{property.views} views</span></div>
                    </div>

                    <div style={styles.actions}>
                      <Link to={`/property/${property._id}`} style={styles.viewBtn}>
                        <Eye size={16} /> View
                      </Link>

                      <button 
                        onClick={() => navigate(`/edit-property/${property._id}`)} 
                        style={styles.editBtn}
                      >
                        <Edit size={16} /> Edit
                      </button>
                      
                      <button onClick={() => handleDelete(property._id)} style={styles.deleteBtn}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020617', paddingTop: '40px', paddingBottom: '60px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  title: { fontSize: '36px', fontWeight: 'bold', color: '#f8fafc', letterSpacing: '-0.5px' },
  subtitle: { color: '#94a3b8', fontSize: '16px', marginTop: '5px' },
  addBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', transition: 'all 0.3s ease' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#0f172a', borderRadius: '24px', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative' },
  imageContainer: { position: 'relative', height: '220px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.8))' },
  badgeBase: { position: 'absolute', top: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '30px', color: 'white', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
  content: { padding: '24px' },
  typeTag: { color: '#3b82f6', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' },
  propertyTitle: { fontSize: '20px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  location: { color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  priceText: { fontSize: '22px', fontWeight: '800', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' },
  purposeTag: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(59, 130, 246, 0.2)' },
  statsRow: { display: 'flex', borderTop: '1px solid #1e293b', paddingTop: '15px', marginBottom: '20px' },
  stat: { display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' },
  actions: { display: 'flex', gap: '10px' }, 
  viewBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px 5px', backgroundColor: 'transparent', color: '#f8fafc', textDecoration: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', border: '1px solid #334155', transition: 'background 0.2s' },
  editBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px 5px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  deleteBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '10px 5px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '80px 40px', backgroundColor: '#0f172a', borderRadius: '24px', border: '1px dashed #334155' },
  emptyIcon: { width: '80px', height: '80px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#3b82f6' },
  emptyTitle: { color: '#fff', fontSize: '24px', fontWeight: 'bold' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#020617', color: '#9ca3af' }
};

export default MyProperties;
