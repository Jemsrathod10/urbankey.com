import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import ComparisonModal from '../components/ComparisonModal'; 
import { AuthContext } from '../context/AuthContext';
import { Filter, SlidersHorizontal, Search, RefreshCcw, LayoutGrid, X, ArrowRightLeft, AlertCircle } from 'lucide-react';

const PropertyListing = ({ purpose: propPurpose }) => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(window.innerWidth > 1024);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const [compareList, setCompareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [showWarning, setShowWarning] = useState(false);

  const [filters, setFilters] = useState({
    purpose: propPurpose || searchParams.get('purpose') || '',
    propertyType: searchParams.get('propertyType') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    furnishing: searchParams.get('furnishing') || ''
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setShowFilters(true);
      else setShowFilters(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        if (propPurpose) params.set('purpose', propPurpose);
        const response = await API.get(`/properties?${params.toString()}`);
        if (response.data && response.data.properties) setProperties(response.data.properties);
        
        if (user) {
          try {
            const favRes = await API.get('/favorites');
            if (favRes.data && favRes.data.favorites) {
              const validFavorites = favRes.data.favorites.filter(f => f.property !== null).map(f => f.property._id);
              setFavorites(validFavorites);
            }
          } catch (favErr) { console.error(favErr); }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    getData();
  }, [searchParams, propPurpose, user]);

  const handleFavorite = async (id) => {
    if (!user) return alert('Please login first');
    try {
      if (favorites.includes(id)) {
        await API.delete(`/favorites/${id}`);
        setFavorites(favorites.filter(favId => favId !== id));
      } else {
        await API.post(`/favorites/${id}`);
        setFavorites([...favorites, id]);
      }
    } catch (e) { console.error(e); }
  };

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

  const applyFilters = () => {
    const newParams = {};
    Object.keys(filters).forEach(k => { if (filters[k]) newParams[k] = filters[k]; });
    setSearchParams(newParams);
    if (window.innerWidth <= 1024) setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ purpose: propPurpose || '', propertyType: '', city: '', minPrice: '', maxPrice: '', bedrooms: '', furnishing: '' });
    setSearchParams({});
  };

  const getImageUrl = (imagePath) => {
    const base = API.defaults.baseURL.replace('/api', '');
    return `${base}/uploads/${imagePath}`;
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }
        
        .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .filter-input:focus { border-color: #3b82f6 !important; background: rgba(15, 23, 42, 0.8) !important; outline: none; }
        .glass-sidebar { backdrop-filter: blur(10px); background: rgba(21, 26, 53, 0.8) !important; }
        .compare-bar-anim { animation: slideUp 0.4s ease-out; }

        @media (max-width: 1024px) {
          .layout-wrapper { flex-direction: column !important; }
          .sidebar-container { 
            position: fixed !important; top: 0; left: 0; width: 100% !important; height: 100vh; 
            z-index: 2000; background: #0a0e27; padding: 20px; overflow-y: auto;
          }
          .main-content { width: 100% !important; }
          .property-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 1024px) {
          .property-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {showWarning && (
        <div style={styles.warningPopup}>
          <div style={styles.warningContent}>
            <AlertCircle color="#fbbf24" size={20} />
            <span style={{fontSize: '13px', fontWeight: '600'}}>Limit: 3 properties only</span>
            <button onClick={() => setShowWarning(false)} style={styles.closeWarning}><X size={14} /></button>
          </div>
          <div style={{...styles.progressBar, animation: 'progress 3s linear forwards'}}></div>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div style={styles.heroSection}>
            <div style={styles.headerText}>
                <h1 style={styles.title}>
                    {propPurpose === 'Sell' ? 'Premium Estates for Sale' : propPurpose === 'Rent' ? 'Modern Rental Homes' : 'Curated Property Listings'}
                </h1>
                <p style={styles.subtitle}>Handpicked premium properties matching your lifestyle.</p>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={styles.filterToggle}>
                <SlidersHorizontal size={18} /> {showFilters ? 'Hide Filters' : 'Filter Search'}
            </button>
        </div>

        <div style={styles.layout} className="layout-wrapper">
          {showFilters && (
            <aside style={styles.sidebar} className="sidebar-container">
              <div style={styles.glassCard} className="glass-sidebar">
                <div style={styles.filterHeader}>
                    <h3 style={styles.sidebarTitle}><Filter size={18} color="#3b82f6" /> Smart Filters</h3>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button onClick={resetFilters} style={styles.resetIconBtn} title="Reset"><RefreshCcw size={16} /></button>
                      {window.innerWidth <= 1024 && <button onClick={() => setShowFilters(false)} style={styles.resetIconBtn}><X size={20} /></button>}
                    </div>
                </div>
                
                <div style={styles.filterBody}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Location</label>
                        <div style={styles.inputWrapper}>
                            <Search size={14} style={styles.iconIn} />
                            <input type="text" className="filter-input" style={styles.input} placeholder="City name..." value={filters.city} onChange={(e) => setFilters({...filters, city: e.target.value})} />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Min Price</label>
                            <input type="number" className="filter-input" style={styles.input} placeholder="Min ₹" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Max Price</label>
                            <input type="number" className="filter-input" style={styles.input} placeholder="Max ₹" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Property Category</label>
                        <select className="filter-input" style={styles.input} value={filters.propertyType} onChange={(e) => setFilters({...filters, propertyType: e.target.value, bedrooms: ['Plot', 'Office', 'Shop', 'Industrial'].includes(e.target.value) ? '' : filters.bedrooms})}>
                            <option value="">All Categories</option>
                            <option value="Flat">Luxury Apartment</option>
                            <option value="House">Penthouse/House</option>
                            <option value="Villa">Exclusive Villa</option>
                            <option value="Plot">Residential Plot</option>
                            <option value="Office">Office Space</option>
                            <option value="Shop">Retail Shop</option>
                        </select>
                    </div>

                    {!['Plot', 'Office', 'Shop', 'Industrial'].includes(filters.propertyType) && (
                      <div style={styles.inputGroup}>
                          <label style={styles.label}>Configuration</label>
                          <select className="filter-input" style={styles.input} value={filters.bedrooms} onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}>
                              <option value="">Any BHK</option>
                              <option value="1">1 BHK</option>
                              <option value="2">2 BHK</option>
                              <option value="3">3 BHK</option>
                              <option value="4">4+ BHK</option>
                          </select>
                      </div>
                    )}

                    <button onClick={applyFilters} style={styles.primaryBtn}>Apply Filters</button>
                </div>
              </div>
            </aside>
          )}

          <main style={styles.mainContent} className="main-content">
            <div style={styles.resultsInfo}>
                <div style={styles.badge}><LayoutGrid size={14} /> Showing {properties.length} matches</div>
            </div>

            {loading ? (
              <div style={styles.loadingArea}><div className="spinner"></div><p style={{fontSize: '14px', color: '#64748b'}}>Scanning for the best deals...</p></div>
            ) : properties.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}><Search size={50} strokeWidth={1.5} /></div>
                <h3 style={{color: '#fff', marginBottom: '10px'}}>No Matches Found</h3>
                <p style={{color: '#64748b', marginBottom: '20px', fontSize: '14px'}}>Try adjusting your filters or location</p>
                <button onClick={resetFilters} style={styles.secondaryBtn}>Clear Filters</button>
              </div>
            ) : (
              <div style={styles.grid} className="property-grid">
                {properties.map(p => (
                  <PropertyCard 
                    key={p._id} 
                    property={p} 
                    onFavorite={handleFavorite} 
                    isFavorite={favorites.includes(p._id)} 
                    onCompare={() => toggleCompare(p)}
                    isComparing={compareList.some(item => item._id === p._id)}
                    isLoggedIn={!!user}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {compareList.length > 0 && (
          <div style={styles.compareBar} className="compare-bar compare-bar-anim">
            <div style={styles.compareThumbnails}>
              {compareList.map(item => (
                <div key={item._id} style={styles.thumbWrapper}>
                  <img src={getImageUrl(item.images[0])} alt="" style={styles.miniThumb} />
                  <button onClick={() => toggleCompare(item)} style={styles.removeThumb}><X size={10} /></button>
                </div>
              ))}
            </div>
            <button style={styles.compareBtn} className="compare-btn" onClick={() => setIsModalOpen(true)}>
              <ArrowRightLeft size={18} /> Compare Properties
            </button>
          </div>
        )}

        <ComparisonModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          compareList={compareList} 
        />
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020617', paddingBottom: '100px', backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)' },
  warningPopup: { position: 'fixed', top: '30px', right: '30px', zIndex: 9999, backgroundColor: '#0f172a', border: '1px solid #fbbf24', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', overflow: 'hidden', width: '280px' },
  warningContent: { padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc' },
  closeWarning: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 'auto' },
  progressBar: { height: '4px', width: '100%', backgroundColor: '#fbbf24' },
  heroSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '40px 0 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  headerText: { flex: 1 },
  title: { fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' },
  subtitle: { color: '#64748b', fontSize: '15px', marginTop: '6px' },
  filterToggle: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', transition: '0.3s' },
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  sidebar: { width: '320px', flexShrink: 0, position: 'sticky', top: '100px' },
  glassCard: { backgroundColor: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  filterHeader: { padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sidebarTitle: { color: '#fff', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' },
  resetIconBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex' },
  filterBody: { padding: '25px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' },
  inputWrapper: { position: 'relative' },
  iconIn: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' },
  input: { width: '100%', padding: '12px 14px', paddingLeft: '36px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff', fontSize: '14px', transition: '0.2s' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  primaryBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' },
  mainContent: { flex: 1 },
  resultsInfo: { marginBottom: '25px' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.03)', color: '#94a3b8', borderRadius: '30px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.05)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  loadingArea: { textAlign: 'center', padding: '100px 0' },
  emptyState: { textAlign: 'center', padding: '80px 40px', backgroundColor: '#0f172a', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' },
  emptyIcon: { color: '#1e293b', marginBottom: '20px' },
  secondaryBtn: { marginTop: '10px', padding: '12px 30px', backgroundColor: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6', borderRadius: '12px', cursor: 'pointer', fontWeight: '800' },
  compareBar: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '24px', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '25px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', zIndex: 1000 },
  compareThumbnails: { display: 'flex', gap: '12px' },
  thumbWrapper: { position: 'relative' },
  miniThumb: { width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #3b82f6' },
  removeThumb: { position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' },
  compareBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', animation: 'pulse 2s infinite' }
};

export default PropertyListing;