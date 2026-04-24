import React from 'react';
import { MapPin, Train, School, Hospital, ShieldCheck, Zap } from 'lucide-react';

const LocationInsights = ({ location, specifications }) => {
  // Logic to calculate a mockup "Liveability Score"
  const calculateScore = () => {
    let score = 70; // Base score
    if (specifications?.furnishing === 'Furnished') score += 10;
    if (location?.city === 'Ahmedabad' || location?.city === 'Surat') score += 5;
    return score > 100 ? 100 : score;
  };

  const score = calculateScore();

  const landmarks = [
    { name: 'City Hospital', dist: '1.2 km', icon: <Hospital size={18} /> },
    { name: 'Metro Station', dist: '0.5 km', icon: <Train size={18} /> },
    { name: 'International School', dist: '2.4 km', icon: <School size={18} /> },
  ];

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>UrbanKey Location Intelligence</h3>
      
      <div style={styles.scoreSection}>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreNumber}>{score}</span>
          <span style={styles.scoreText}>Liveability</span>
        </div>
        <div style={styles.insights}>
          <div style={styles.insightItem}>
            <ShieldCheck size={18} color="#22c55e" />
            <span>High Safety Zone</span>
          </div>
          <div style={styles.insightItem}>
            <Zap size={18} color="#eab308" />
            <span>Excellent Connectivity</span>
          </div>
        </div>
      </div>

      <div style={styles.landmarkGrid}>
        {landmarks.map((l, i) => (
          <div key={i} style={styles.landmarkItem}>
            <div style={styles.iconWrapper}>{l.icon}</div>
            <div style={styles.landmarkInfo}>
              <span style={styles.lName}>{l.name}</span>
              <span style={styles.lDist}>{l.dist} {parseFloat(l.dist) < 1 && <span style={styles.walkTag}>Walk</span>}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#1e293b', borderRadius: '20px', padding: '25px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '20px' },
  title: { fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#f8fafc', borderLeft: '4px solid #3b82f6', paddingLeft: '12px' },
  scoreSection: { display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '25px', padding: '15px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '15px' },
  scoreCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  scoreNumber: { fontSize: '24px', fontWeight: 'bold', color: '#fff' },
  scoreText: { fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' },
  insights: { display: 'flex', flexDirection: 'column', gap: '10px' },
  insightItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#e2e8f0' },
  landmarkGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  landmarkItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' },
  iconWrapper: { color: '#3b82f6' },
  landmarkInfo: { display: 'flex', flexDirection: 'column' },
  lName: { fontSize: '13px', color: '#f8fafc', fontWeight: '500' },
  lDist: { fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },
  walkTag: { backgroundColor: '#22c55e', color: '#fff', fontSize: '9px', padding: '1px 5px', borderRadius: '4px' }
};

export default LocationInsights;
