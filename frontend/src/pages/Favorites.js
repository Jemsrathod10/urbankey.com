import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import ComparisonModal from '../components/ComparisonModal';
import { Heart, Home, X, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Comparison State ---
  const [compareList, setCompareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites');
      setFavorites(data.favorites);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await API.delete(`/favorites/${propertyId}`);
      setFavorites(favorites.filter(f => f.property._id !== propertyId));
    } catch (error) {
      console.error(error);
    }
  };

  // --- Comparison Logic ---
  const toggleCompare = (property) => {
    setCompareList(prev => {
      if (prev.find(p => p._id === property._id)) {
        return prev.filter(p => p._id !== property._id);
      }
      if (prev.length >= 3) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return prev;
      }
      return [...prev, property];
    });
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner"></div>
        <p style={{marginTop: '20px'}}>Loading your favorite collection...</p>
      </div>
    );
  }

  // Check login status to pass to children if needed
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div style={styles.container}>
      {/* Warning Popup */}
      {showWarning && (
        <div style={styles.warningPopup}>
          <div style={styles.warningContent}>
            <AlertCircle color="#fbbf24" size={20} />
            <span>You can only compare up to 3 properties at a time.</span>
            <button onClick={() => setShowWarning(false)} style={styles.closeWarning}><X size={14} /></button>
          </div>
          <div style={styles.progressBar}></div>
        </div>
      )}

      <div className="container">
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <Heart size={40} fill="#ef4444" color="#ef4444" />
          </div>
          <h1 style={styles.title}>My Favorites</h1>
          <p style={styles.subtitle}>Properties you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIconBg}>
                <Home size={64} color="#3b82f6" />
            </div>
            <h3 style={styles.emptyTitle}>No favorites yet</h3>
            <p style={styles.emptyText}>Start adding properties to your favorites to see them here!</p>
            <Link to="/properties" style={styles.exploreBtn}>Explore Properties</Link>
          </div>
        ) : (
          <>
            <div style={styles.topInfo}>
                <p style={styles.count}>{favorites.length} properties found in your list</p>
            </div>
            <div style={styles.gridContainer}>
              {favorites.map(fav => (
                <div key={fav._id} style={styles.cardWrapper}>
                    <PropertyCard 
                        property={fav.property}
                        onFavorite={handleRemoveFavorite}
                        isFavorite={true}
                        // Explicitly passing login state to fix the UI popup issue
                        isLoggedIn={isLoggedIn} 
                        onCompare={() => toggleCompare(fav.property)}
                        isComparing={compareList.some(item => item._id === fav.property?._id)}
                    />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Comparison Floating Bar */}
      {compareList.length > 0 && (
        <div style={styles.compareBar}>
          <div style={styles.compareThumbnails}>
            {compareList.map(item => (
              <div key={item._id} style={styles.thumbWrapper}>
                <img src={`http://localhost:5000/uploads/${item.images[0]}`} alt="" style={styles.miniThumb} />
                <button onClick={() => toggleCompare(item)} style={styles.removeThumb}><X size={12} /></button>
              </div>
            ))}
          </div>
          <button style={styles.compareBtn} onClick={() => setIsModalOpen(true)}>
            <ArrowRightLeft size={18} /> Compare ({compareList.length}/3)
          </button>
        </div>
      )}

      <ComparisonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        compareList={compareList} 
      />
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020617', paddingTop: '60px', paddingBottom: '100px' },
  warningPopup: { position: 'fixed', top: '20px', right: '20px', zIndex: 9999, backgroundColor: '#1e293b', border: '1px solid #fbbf24', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)', overflow: 'hidden' },
  warningContent: { padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontSize: '14px' },
  closeWarning: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: '10px' },
  progressBar: { height: '3px', width: '100%', backgroundColor: '#fbbf24' },
  header: { textAlign: 'center', marginBottom: '60px' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(239, 68, 68, 0.2)' },
  title: { fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '12px', color: '#f8fafc', letterSpacing: '-1px' },
  subtitle: { fontSize: '18px', color: '#94a3b8' },
  topInfo: { marginBottom: '30px', borderBottom: '1px solid #1f2937', paddingBottom: '20px' },
  count: { color: '#3b82f6', fontSize: '16px', fontWeight: '600' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  cardWrapper: { transition: 'transform 0.3s ease' },
  empty: { textAlign: 'center', padding: '100px 20px', backgroundColor: '#1e293b', borderRadius: '24px', border: '1px solid #1f2937', maxWidth: '600px', margin: '0 auto' },
  emptyIconBg: { width: '120px', height: '120px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  emptyTitle: { fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#e5e7eb' },
  emptyText: { fontSize: '16px', color: '#9ca3af', marginBottom: '30px' },
  exploreBtn: { padding: '12px 30px', backgroundColor: '#3b82f6', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#020617', color: '#9ca3af' },
  compareBar: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '20px', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000 },
  compareThumbnails: { display: 'flex', gap: '10px' },
  thumbWrapper: { position: 'relative' },
  miniThumb: { width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #3b82f6' },
  removeThumb: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  compareBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default Favorites;