import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, IndianRupee, Heart, ArrowUpRight, ArrowRightLeft, Lock, AlertCircle } from 'lucide-react';

const PropertyCard = ({ property, onFavorite, isFavorite, onCompare, isComparing, isLoggedIn }) => {
  const [errorMsg, setErrorMsg] = useState("");

  if (!property || !property._id) return null;

  // --- ADDED: Robust Login Check ---
  // This ensures that even if the parent fails to pass isLoggedIn, 
  // the card checks localStorage directly so the "Login to favorite" popup doesn't show for logged-in users.
  const authStatus = isLoggedIn !== undefined ? isLoggedIn : !!localStorage.getItem('token');

  // જો તમે ngrok વાપરો તો અહીં તેની લિંક મૂકવી. 
  // અત્યારે મેં એવું લોજિક મૂક્યું છે કે જે સરળતાથી બદલી શકાય.
  const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000" 
    : `http://${window.location.hostname}:5000`; 

  // જો તમે પ્રોડક્શન (Live Domain) પર હોવ, તો સીધું જ સર્વરનું URL લખી શકાય:
  // const BASE_URL = "https://your-backend-api.com";

  const imageUrl =
    property.images && property.images.length > 0
      ? `${BASE_URL}/uploads/${property.images[0]}`
      : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

  const formatPrice = (num) => {
    if (!num) return "Price on Request";
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lakh`;
    return num.toLocaleString('en-IN');
  };

  const handleError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000); 
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={property.title}
          style={styles.image}
          onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800')}
        />
        
        <div style={styles.overlayTop}>
          <div style={styles.statusBadge}>
            <div style={styles.dot}></div>
            {property.purpose === 'Sell' ? 'Sale' : 'Rent'}
          </div>
          <div style={{ display: 'flex', gap: '6px', position: 'relative' }}>
            
            {errorMsg && (
              <div style={styles.errorTooltip}>
                <AlertCircle size={12} /> {errorMsg}
              </div>
            )}

             <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!authStatus) {
                  handleError("Login to compare");
                  return;
                }
                if (typeof onCompare === 'function') onCompare(property);
              }}
              style={{
                ...styles.actionBtn, 
                backgroundColor: isComparing ? '#3b82f6' : 'rgba(15, 23, 42, 0.7)',
                borderColor: isComparing ? '#fff' : 'rgba(255,255,255,0.2)'
              }}
            >
              <ArrowRightLeft size={16} color="white" />
            </button>

            {onFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!authStatus) {
                    handleError("Login to favorite");
                    return;
                  }
                  onFavorite(property._id);
                }}
                style={{
                  ...styles.actionBtn,
                  backgroundColor: isFavorite ? '#ef4444' : 'rgba(15, 23, 42, 0.7)',
                  borderColor: isFavorite ? '#fff' : 'rgba(255,255,255,0.2)'
                }}
              >
                <Heart size={16} fill={isFavorite ? '#fff' : 'none'} color="white" />
              </button>
            )}
          </div>
        </div>
        
        {property.featured && (
          <div style={styles.featuredBadge}>⭐ Featured</div>
        )}
        <div style={styles.imageOverlayShadow}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.topRow}>
          <div style={styles.priceWrapper}>
            <IndianRupee size={16} color="#60a5fa" />
            <span style={styles.priceText}>
              {authStatus ? formatPrice(property.price) : "****"}
            </span>
          </div>
          <span style={styles.typeTag}>{property.propertyType}</span>
        </div>

        <h3 style={styles.title}>{property.title}</h3>
        
        <div style={styles.location}>
          <MapPin size={12} color="#3b82f6" />
          <span>{authStatus ? property.location?.city : "Sign in to view location"}</span>
        </div>

        {authStatus ? (
          <div style={styles.specsGrid}>
            {property.specifications?.bedrooms > 0 && (
              <div style={styles.specItem}>
                <Bed size={14} style={styles.specIcon} />
                <span style={styles.specValue}>{property.specifications.bedrooms}BHK</span>
              </div>
            )}
            <div style={styles.specItem}>
              <Square size={14} style={styles.specIcon} />
              <span style={styles.specValue}>{property.specifications?.area}ft²</span>
            </div>
          </div>
        ) : (
          <div style={{...styles.specsGrid, justifyContent: 'center', color: '#94a3b8', fontSize: '11px', gap: '5px'}}>
            <Lock size={12} /> Login to see details
          </div>
        )}

        <Link to={`/property/${property._id}`} style={styles.viewBtn}>
          Details <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: { 
    backgroundColor: '#0f172a', 
    borderRadius: '24px', 
    overflow: 'hidden', 
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    width: '100%',
    maxWidth: '350px', 
    margin: 'auto'
  },
  imageContainer: { 
    position: 'relative', 
    height: '180px', 
    overflow: 'hidden', 
    margin: '8px', 
    borderRadius: '18px' 
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imageOverlayShadow: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)',
    zIndex: 1
  },
  overlayTop: { 
    position: 'absolute', top: '10px', left: '10px', right: '10px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 
  },
  statusBadge: { 
    background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', color: '#fff', 
    padding: '4px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', 
    display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.1)' 
  },
  dot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' },
  actionBtn: { 
    backdropFilter: 'blur(8px)', border: '1px solid', borderRadius: '10px', 
    width: '34px', height: '34px', cursor: 'pointer', display: 'flex', 
    alignItems: 'center', justifyContent: 'center' 
  },
  errorTooltip: {
    position: 'absolute',
    top: '40px',
    right: '0',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    whiteSpace: 'nowrap',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  featuredBadge: { 
    position: 'absolute', bottom: '10px', left: '10px', 
    background: '#fff', color: '#0f172a', padding: '4px 8px', 
    borderRadius: '8px', fontSize: '10px', fontWeight: '900', zIndex: 5 
  },
  content: { padding: '8px 15px 15px 15px', display: 'flex', flexDirection: 'column', flex: 1 },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  priceWrapper: { display: 'flex', alignItems: 'center', gap: '2px' },
  priceText: { fontSize: '18px', fontWeight: '900', color: '#fff' },
  typeTag: { 
    fontSize: '9px', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', 
    padding: '3px 8px', borderRadius: '6px', fontWeight: '800', textTransform: 'uppercase' 
  },
  title: { 
    fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '4px', 
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' 
  },
  location: { 
    display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', 
    marginBottom: '12px', fontSize: '12px' 
  },
  specsGrid: { 
    display: 'flex', gap: '12px', 
    background: 'rgba(255,255,255,0.02)', padding: '10px 12px', 
    borderRadius: '14px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)'
  },
  specItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  specIcon: { color: '#64748b' },
  specValue: { color: '#e2e8f0', fontSize: '12px', fontWeight: '700' },
  viewBtn: { 
    marginTop: 'auto', width: '100%', padding: '10px', 
    background: '#fff', color: '#0f172a', textDecoration: 'none', 
    borderRadius: '12px', fontSize: '13px', fontWeight: '900', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
  }
};

export default PropertyCard;