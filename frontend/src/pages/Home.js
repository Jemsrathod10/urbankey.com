import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, TrendingUp, Shield, Award, MapPin, X, ArrowRightLeft, AlertCircle, Sparkles, Building, ChevronRight, Home as HomeIcon, Store, Warehouse, Trees, ArrowUpRight } from 'lucide-react';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import { AuthContext } from '../context/AuthContext';
import ComparisonModal from '../components/ComparisonModal';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ purpose: '', propertyType: '', city: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [compareList, setCompareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const categoryLabels = [
    'Flat / Apartment', 
    'House / Bungalow', 
    'Villa', 
    'Plot / Land', 
    'Office Space', 
    'Shop / Showroom', 
    'Warehouse', 
    'Farmhouse'
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data } = await API.get('/properties?limit=6');
        setProperties(data.properties);
        if (user) {
          const favRes = await API.get('/favorites');
          setFavorites(favRes.data.favorites.filter(f => f.property).map(f => f.property._id));
        }
      } catch (error) { 
        console.error("Error fetching home data:", error); 
      }
    };
    fetchInitialData();
  }, [user]);

  const handleFavorite = async (propertyId) => {
    if (!user) { navigate('/login'); return; }
    try {
      if (favorites.includes(propertyId)) {
        await API.delete(`/favorites/${propertyId}`);
        setFavorites(favorites.filter(id => id !== propertyId));
      } else {
        await API.post(`/favorites/${propertyId}`);
        setFavorites([...favorites, propertyId]);
      }
    } catch (error) { console.error(error); }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.purpose) params.append('purpose', filters.purpose);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.city) params.append('city', filters.city);
    navigate(`/properties?${params.toString()}`);
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

  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @media (max-width: 1024px) {
            .hero-container { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
            .hero-left { display: flex; flex-direction: column; align-items: center; }
            .hero-right { display: block !important; height: 400px !important; margin-top: 40px; }
            .exclusive-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .bento-container { grid-template-columns: 1fr !important; }
          }

          @media (max-width: 768px) {
            .search-inputs { flex-direction: column !important; }
            .search-divider-mid { display: none !important; }
            .hero-title { font-size: 42px !important; }
            .bento-side-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .section-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
            .compare-bar { width: 90% !important; flex-direction: column !important; border-radius: 20px !important; gap: 15px !important; bottom: 15px !important; }
            .hero-right { height: 350px !important; }
          }

          @media (max-width: 480px) {
            .exclusive-grid { grid-template-columns: 1fr !important; }
            .bento-side-grid { grid-template-columns: 1fr !important; }
            .bento-wide-small { grid-column: span 1 !important; }
            .quick-stats { gap: 15px !important; justify-content: center; flex-wrap: wrap; }
            .stat-number { font-size: 24px !important; }
          }
          
          select option {
            background-color: #1e293b !important;
            color: #ffffff !important;
          }
        `}
      </style>
      
      {showWarning && (
        <div style={styles.warningPopup}>
          <div style={styles.warningContent}>
            <AlertCircle color="#fbbf24" size={20} />
            <span>Maximum 3 properties can be compared</span>
            <button onClick={() => setShowWarning(false)} style={styles.closeWarning}><X size={14} /></button>
          </div>
          <div style={styles.progressBar}></div>
        </div>
      )}

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div className="container hero-container" style={styles.heroContainer}>
          <div className="hero-left" style={styles.heroLeft}>
            <div style={styles.floatingBadge}>
              <input type="hidden" />
              <Sparkles size={16} />
              <span>PREMIUM REAL ESTATE</span>
            </div>
            
            <h1 className="hero-title" style={styles.heroTitle}>
              Find Your
              <span style={styles.titleHighlight}> Perfect Home</span>
              <br />
              in Minutes
            </h1>
            
            <p style={styles.heroDesc}>
              Discover verified properties from trusted owners and agents across India. 
              Your dream home is just a search away.
            </p>

            <div className="quick-stats" style={styles.quickStats}>
              <div style={styles.statItem}>
                <div className="stat-number" style={styles.statNumber}>10K+</div>
                <div style={styles.statLabel}>Properties</div>
              </div>
              <div className="stat-divider" style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div className="stat-number" style={styles.statNumber}>5K+</div>
                <div style={styles.statLabel}>Happy Clients</div>
              </div>
              <div className="stat-divider" style={styles.statDivider}></div>
              <div style={styles.statItem}>
                <div className="stat-number" style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Agents</div>
              </div>
            </div>

            <div style={styles.modernSearch}>
              <div style={styles.searchTabs}>
                <button 
                  style={{...styles.searchTab, ...(filters.purpose === 'Sell' ? styles.searchTabActive : {})}}
                  onClick={() => setFilters({...filters, purpose: 'Sell'})}
                >
                  Buy
                </button>
                <button 
                  style={{...styles.searchTab, ...(filters.purpose === 'Rent' ? styles.searchTabActive : {})}}
                  onClick={() => setFilters({...filters, purpose: 'Rent'})}
                >
                  Rent
                </button>
              </div>
              
              <div className="search-inputs" style={styles.searchInputs}>
                <div style={styles.searchField}>
                  <Building2 size={18} color="#3b82f6" />
                  <select 
                    style={styles.searchSelect} 
                    value={filters.propertyType} 
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                  >
                    <option value="" style={styles.optionStyle}>Property Type</option>
                    {categoryLabels.map(t => (
                      <option key={t} value={t} style={styles.optionStyle}>{t}</option>
                    ))}
                  </select>
                </div>
                
                <div className="search-divider-mid" style={styles.searchDividerMid}></div>
                
                <div style={styles.searchField}>
                  <MapPin size={18} color="#3b82f6" />
                  <input 
                    type="text" 
                    placeholder="Enter City or Area" 
                    style={styles.searchInput}
                    value={filters.city} 
                    onChange={(e) => setFilters({...filters, city: e.target.value})} 
                  />
                </div>
                
                <button onClick={handleSearch} style={styles.searchButton}>
                  <Search size={20} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          <div className="hero-right" style={styles.heroRight}>
            <div style={styles.imageGrid}>
              <div style={styles.gridItem1}>
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=100&w=1600&auto=format&fit=crop" alt="Premium Villa" style={styles.gridImage} />
                <div style={styles.imageBadge}>
                  <span style={styles.badgeIcon}>🏠</span>
                  <span>Modern Villas</span>
                </div>
              </div>
              <div style={styles.gridItem2}>
                <img src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=100&w=1200&auto=format&fit=crop" alt="Luxury Interior" style={styles.gridImage} />
              </div>
              <div style={styles.gridItem3}>
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=100&w=1200&auto=format&fit=crop" alt="Commercial Estate" style={styles.gridImage} />
                <div style={styles.imageBadge}>
                  <span style={styles.badgeIcon}>🏢</span>
                  <span>Commercial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. PREMIUM PROPERTIES SECTION */}
      <section style={styles.propertiesSection}>
        <div className="container">
          <div className="section-header" style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionBadge}>
                <Sparkles size={14} />
                <span>EXCLUSIVE</span>
              </div>
              <h2 style={styles.sectionTitle}>Premium Properties</h2>
              <p style={styles.sectionSub}>Explore our handpicked collection</p>
            </div>
            <Link to="/properties" style={styles.viewAllBtn}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="exclusive-grid" style={styles.exclusiveGrid}>
            {properties.slice(0, 3).map((p) => (
              <div key={p._id}>
                <PropertyCard 
                  property={p} 
                  onFavorite={handleFavorite} 
                  isFavorite={favorites.includes(p._id)} 
                  onCompare={() => toggleCompare(p)}
                  isComparing={compareList.some(item => item._id === p._id)}
                  isLoggedIn={!!user}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MODERN SMART EXPLORER */}
      <section style={styles.explorerSection}>
        <div className="container">
          <div style={styles.explorerHeader}>
            <h2 style={styles.explorerTitle}>Smart Explorer</h2>
            <p style={styles.explorerSub}>Search by property categories</p>
          </div>
          
          <div className="bento-container" style={styles.bentoContainer}>
            <Link to="/properties?propertyType=Flat / Apartment" style={styles.bentoMain}>
                <div style={styles.bentoTag}>Popular</div>
                <Building size={48} color="#3b82f6" strokeWidth={1.5} />
                <div style={styles.bentoTextGroup}>
                  <h3>Modern Apartments</h3>
                  <p>Premium living in the heart of the city</p>
                </div>
                <ArrowUpRight style={styles.topRightArrow} />
            </Link>

            <div className="bento-side-grid" style={styles.bentoSideGrid}>
              <Link to="/properties?propertyType=Villa" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <Sparkles size={24} color="#8b5cf6" />
                <span>Villas</span>
              </Link>
              <Link to="/properties?propertyType=House / Bungalow" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <HomeIcon size={24} color="#10b981" />
                <span>Bungalows</span>
              </Link>
              <Link to="/properties?propertyType=Office Space" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <Building2 size={24} color="#3b82f6" />
                <span>Offices</span>
              </Link>
              <Link to="/properties?propertyType=Shop / Showroom" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <Store size={24} color="#ef4444" />
                <span>Shops</span>
              </Link>
              <Link to="/properties?propertyType=Warehouse" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <Warehouse size={24} color="#f59e0b" />
                <span>Warehouse</span>
              </Link>
              <Link to="/properties?propertyType=Plot / Land" style={{...styles.bentoSmall, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'}}>
                <MapPin size={24} color="#06b6d4" />
                <span>Lands</span>
              </Link>
              <Link to="/properties?propertyType=Farmhouse" className="bento-wide-small" style={styles.bentoWideSmall}>
                <Trees size={24} color="#ec4899" />
                <span>Farmhouses & Weekend Homes</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON BAR */}
      {compareList.length > 0 && (
        <div className="compare-bar" style={styles.compareBar}>
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

      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} compareList={compareList} />
    </div>
  );
};

const styles = {
  wrapper: { backgroundColor: '#020617', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' },
  warningPopup: { position: 'fixed', top: '20px', right: '20px', zIndex: 9999, backgroundColor: '#1e293b', border: '1px solid #fbbf24', borderRadius: '12px', overflow: 'hidden' },
  warningContent: { padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#f8fafc', fontSize: '14px' },
  closeWarning: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  progressBar: { height: '3px', width: '100%', backgroundColor: '#fbbf24' },
  hero: { padding: '80px 20px', backgroundColor: '#020617' },
  heroContainer: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' },
  heroTitle: { fontSize: 'clamp(32px, 6vw, 68px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', color: '#ffffff' },
  titleHighlight: { background: 'linear-gradient(135deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroDesc: { fontSize: '18px', color: '#94a3b8', marginBottom: '32px', maxWidth: '600px' },
  quickStats: { display: 'flex', gap: '30px', marginBottom: '40px' },
  statNumber: { fontSize: '32px', fontWeight: '800' },
  statLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase' },
  statDivider: { width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)' },
  modernSearch: { backgroundColor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '15px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '800px' },
  searchTabs: { display: 'flex', gap: '8px', marginBottom: '12px' },
  searchTab: { padding: '10px 24px', border: 'none', color: '#64748b', cursor: 'pointer', borderRadius: '12px', background: 'none' },
  searchTabActive: { backgroundColor: '#3b82f6', color: '#fff' },
  searchInputs: { display: 'flex', gap: '15px' },
  searchField: { flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px' },
  searchSelect: { background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '14px', cursor: 'pointer' },
  optionStyle: { backgroundColor: '#1e293b', color: '#ffffff' },
  searchInput: { background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '14px' },
  searchButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px 28px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer' },
  heroRight: { position: 'relative', height: '500px' },
  imageGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' },
  gridItem1: { gridRow: 'span 2', borderRadius: '32px', overflow: 'hidden', position: 'relative' },
  gridItem2: { borderRadius: '32px', overflow: 'hidden' },
  gridItem3: { borderRadius: '32px', overflow: 'hidden', position: 'relative' },
  gridImage: { width: '100%', height: '100%', objectFit: 'cover' },
  imageBadge: { position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '8px 16px', borderRadius: '100px', fontSize: '12px' },
  propertiesSection: { padding: '60px 20px', backgroundColor: '#020617' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  sectionBadge: { color: '#3b82f6', fontWeight: '700', fontSize: '12px', marginBottom: '10px', display: 'block' },
  sectionTitle: { fontSize: '32px', fontWeight: '800' },
  sectionSub: { color: '#64748b' },
  viewAllBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#1e293b', borderRadius: '14px', color: '#fff', textDecoration: 'none' },
  exclusiveGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' },
  explorerSection: { padding: '60px 20px', backgroundColor: '#020617' },
  explorerHeader: { textAlign: 'center', marginBottom: '50px' },
  explorerTitle: { fontSize: '32px', fontWeight: '800' },
  explorerSub: { color: '#64748b' },
  bentoContainer: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
  bentoMain: { position: 'relative', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textDecoration: 'none', color: '#fff', overflow: 'hidden', minHeight: '300px' },
  bentoTag: { position: 'absolute', top: '30px', left: '40px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' },
  bentoTextGroup: { marginTop: '30px' },
  topRightArrow: { position: 'absolute', top: '30px', right: '30px', opacity: 0.6 },
  bentoSideGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  bentoSmall: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '25px', borderRadius: '24px', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' },
  bentoWideSmall: { gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 30px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' },
  compareBar: { position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '100px', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '25px', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  compareThumbnails: { display: 'flex', gap: '12px' },
  thumbWrapper: { position: 'relative' },
  miniThumb: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' },
  removeThumb: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' },
  compareBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '100px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
  floatingBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '100px', color: '#3b82f6', fontSize: '12px', fontWeight: '700', marginBottom: '20px', width: 'fit-content' }
};

export default Home;