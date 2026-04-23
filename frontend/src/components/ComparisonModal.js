import React from 'react';
import { X, Check, IndianRupee, AlertCircle } from 'lucide-react';

const ComparisonModal = ({ isOpen, onClose, compareList }) => {
  if (!isOpen) return null;

  const formatPrice = (num) => {
    if (!num) return "Price on Request";
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lakh`;
    return num.toLocaleString('en-IN');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header with High Contrast */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Property Comparison</h2>
            <p style={styles.subtitle}>{compareList.length} Units Selected</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}><X size={24} /></button>
        </div>

        <div style={styles.tableWrapper}>
          {compareList.length < 2 ? (
            <div style={styles.emptyState}>
              <div style={styles.alertIconBg}><AlertCircle size={40} color="#3b82f6" /></div>
              <p style={styles.emptyText}>Please select at least 2 properties to compare.</p>
              <button onClick={onClose} style={styles.backBtn}>Go Back</button>
            </div>
          ) : (
            /* Scroll Container Added for Phone View */
            <div style={styles.responsiveScroll}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.featureCol}>Specifications</th>
                    {compareList.map(item => (
                      <th key={item._id} style={styles.propCol}>
                        <div style={styles.imageCard}>
                          <img 
                            src={`http://localhost:5000/uploads/${item.images[0]}`} 
                            alt="" 
                            style={styles.image} 
                          />
                          <div style={styles.imgGradient}></div>
                        </div>
                        <div style={styles.propTitle}>{item.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.featureLabel}>Final Price</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.priceCell}>
                        <div style={styles.priceTag}>
                          <IndianRupee size={16} /> {formatPrice(item.price)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={styles.featureLabel}>Category</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.dataCell}>
                        <span style={styles.typeBadge}>{item.propertyType}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={styles.featureLabel}>City</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.dataCellText}>{item.location?.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={styles.featureLabel}>Built-up Area</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.dataCell}>
                        <span style={styles.boldText}>{item.specifications?.area}</span>
                        <span style={styles.unitText}> sq.ft</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={styles.featureLabel}>Bedroom Plan</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.dataCellText}>{item.specifications?.bedrooms || 'N/A'} BHK</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={styles.featureLabel}>Furnishing</td>
                    {compareList.map(item => (
                      <td key={item._id} style={styles.furnishCell}>{item.specifications?.furnishing}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' },
  modal: { backgroundColor: '#0f172a', width: '100%', maxWidth: '1100px', maxHeight: '90vh', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' },
  title: { fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' },
  subtitle: { color: '#94a3b8', fontSize: '12px', marginTop: '2px' },
  closeBtn: { background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  tableWrapper: { padding: '0 10px 20px 10px', overflow: 'hidden' },
  // Important for Phone View:
  responsiveScroll: { 
    overflowX: 'auto', 
    WebkitOverflowScrolling: 'touch', 
    paddingBottom: '10px' 
  },
  
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0', minWidth: '650px' }, // minWidth stops compression on phone
  
  featureCol: { 
    textAlign: 'left', padding: '20px 15px', color: '#3b82f6', fontSize: '11px', 
    textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '800',
    position: 'sticky', left: 0, backgroundColor: '#0f172a', zIndex: 5 // Keeps labels visible while scrolling
  },
  propCol: { padding: '15px 15px 25px 15px', minWidth: '220px', verticalAlign: 'top' },
  imageCard: { position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '130px', border: '1px solid rgba(255,255,255,0.15)', marginBottom: '12px' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imgGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, #0f172a, transparent)' },
  propTitle: { fontSize: '14px', fontWeight: '700', lineHeight: '1.4', color: '#f8fafc', textAlign: 'center' },
  
  featureLabel: { 
    padding: '18px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1', 
    fontWeight: '600', fontSize: '13px', position: 'sticky', left: 0, backgroundColor: '#0f172a', zIndex: 5 
  },
  priceCell: { padding: '18px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' },
  priceTag: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '16px', fontWeight: '800' },
  dataCell: { padding: '18px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' },
  dataCellText: { padding: '18px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#f1f5f9', fontSize: '14px', fontWeight: '500' },
  furnishCell: { padding: '18px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#f1f5f9', fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' },
  typeBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid rgba(59, 130, 246, 0.2)' },
  boldText: { color: '#ffffff', fontWeight: '800', fontSize: '15px' },
  unitText: { color: '#94a3b8', fontSize: '11px', fontWeight: '500' },
  
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' },
  alertIconBg: { padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', marginBottom: '20px' },
  emptyText: { fontSize: '16px', color: '#cbd5e1', fontWeight: '500' },
  backBtn: { marginTop: '20px', padding: '10px 30px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }
};

export default ComparisonModal;