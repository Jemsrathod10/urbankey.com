import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, TrendingUp } from 'lucide-react';

const EMICalculator = ({ initialPrice }) => {
  const defaultAmount = initialPrice ? initialPrice : 5000000;
  
  const [p, setP] = useState(defaultAmount);
  const [r, setR] = useState(8.5);
  const [n, setN] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const monthlyRate = r / 12 / 100;
    const months = n * 12;
    if (monthlyRate > 0) {
      const emiCalc = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      setEmi(Math.round(emiCalc));
    }
  }, [p, r, n]);

  return (
    <div style={styles.card}>
      <div style={styles.topInfo}>
        <div style={styles.iconBox}><Calculator size={22} color="#fff" /></div>
        <div>
          <h3 style={styles.title}>Financial Planner</h3>
          <p style={styles.tagline}>Plan your investment wisely</p>
        </div>
      </div>
      
      <div style={styles.formSection}>
        {/* Loan Amount */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <label style={styles.label}>Loan Principal</label>
            <div style={styles.valueBadge}>₹ {(p / 100000).toFixed(2)} Lac</div>
          </div>
          <input 
            type="range" min="100000" max="20000000" step="50000"
            value={p} onChange={(e) => setP(e.target.value)} style={styles.slider} 
          />
        </div>

        {/* Interest Rate */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <label style={styles.label}>Annual Interest</label>
            <div style={styles.valueBadge}>{r}%</div>
          </div>
          <input 
            type="range" min="5" max="15" step="0.1"
            value={r} onChange={(e) => setR(e.target.value)} style={styles.slider} 
          />
        </div>

        {/* Tenure */}
        <div style={styles.field}>
          <div style={styles.labelRow}>
            <label style={styles.label}>Time Period</label>
            <div style={styles.valueBadge}>{n} Years</div>
          </div>
          <input 
            type="range" min="1" max="30" step="1"
            value={n} onChange={(e) => setN(e.target.value)} style={styles.slider} 
          />
        </div>
      </div>

      <div style={styles.resultContainer}>
        <div style={styles.emiHeader}>
          <TrendingUp size={14} color="#10b981" />
          <span>ESTIMATED EMI</span>
        </div>
        <div style={styles.finalAmount}>
          <span style={styles.currency}>₹</span>
          {emi.toLocaleString('en-IN')}
          <span style={styles.perMonth}>/mo</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '35px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', marginTop: '20px' },
  topInfo: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' },
  iconBox: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', padding: '12px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' },
  title: { color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 },
  tagline: { color: '#64748b', fontSize: '12px', marginTop: '2px' },
  formSection: { display: 'flex', flexDirection: 'column', gap: '25px' },
  field: { display: 'flex', flexDirection: 'column', gap: '15px' },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  valueBadge: { color: '#fff', backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '5px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', border: '1px solid rgba(59, 130, 246, 0.2)' },
  slider: { width: '100%', cursor: 'pointer', accentColor: '#3b82f6', height: '5px' },
  resultContainer: { marginTop: '30px', padding: '30px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' },
  emiHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', marginBottom: '10px' },
  finalAmount: { color: '#fff', fontSize: '38px', fontWeight: '900', letterSpacing: '-1px' },
  currency: { color: '#3b82f6', marginRight: '5px', fontSize: '24px' },
  perMonth: { fontSize: '14px', color: '#475569', marginLeft: '5px', fontWeight: '500' }
};

export default EMICalculator;