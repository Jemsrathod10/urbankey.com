import React from 'react';
import { Building2, Target, Award, Users, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={styles.container}>
      {/* Dynamic Hover Styles for Attractive Cards */}
      <style>
        {`
          .glass-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .glass-card:hover {
            transform: translateY(-12px);
            background: rgba(30, 41, 59, 0.6) !important;
            border-color: rgba(59, 130, 246, 0.5) !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }
          .icon-bounce {
            transition: transform 0.5s ease;
          }
          .glass-card:hover .icon-bounce {
            transform: scale(1.2) rotate(5deg);
          }
          .list-item-hover {
            transition: all 0.3s ease;
          }
          .list-item-hover:hover {
            transform: scale(1.03);
            background: rgba(59, 130, 246, 0.1) !important;
            border-color: #3b82f6 !important;
          }
          .gradient-text {
            background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      <div className="container">
        <div style={styles.hero}>
          <h1 style={styles.title} className="gradient-text">About UrbanKey</h1>
          <p style={styles.subtitle}>Modern way to find your next home.</p>
        </div>

        <div style={styles.content}>
          <section style={styles.section}>
            {/* Featured Hero Card */}
            <div className="glass-card" style={styles.mainGlassCard}>
              <div style={styles.badge}>Established 2024</div>
              <h2 style={styles.sectionTitle}>Who We Are</h2>
              <p style={styles.text}>
                UrbanKey is a leading online real estate platform connecting property buyers, 
                sellers, and renters across India. Trusted by thousands in Gujarat, we make 
                finding your dream property transparent, fast, and secure.
              </p>
            </div>
          </section>

          {/* Attractive Grid Section */}
          <div style={styles.grid}>
            {[
              { 
                icon: <Target size={32} />, 
                title: "Our Mission", 
                text: "To simplify property search and make real estate transactions transparent and hassle-free." 
              },
              { 
                icon: <Award size={32} />, 
                title: "Our Vision", 
                text: "To become India's most trusted property portal with verified listings and excellent service." 
              },
              { 
                icon: <Users size={32} />, 
                title: "Our Values", 
                text: "Transparency, trust, and customer satisfaction drive everything we do." 
              }
            ].map((item, index) => (
              <div key={index} className="glass-card" style={styles.card}>
                <div className="icon-bounce" style={styles.iconWrapper}>{item.icon}</div>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardText}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Benefits Section with Attractive List Items */}
          <section style={styles.section}>
            <h2 style={{...styles.sectionTitle, textAlign: 'center', marginBottom: '40px'}}>Why Choose Us?</h2>
            <div style={styles.listGrid}>
              {[
                "Verified property listings", "Wide range of properties", 
                "Direct contact with owners", "Easy search and filters", 
                "24/7 customer support", "Secure transactions"
              ].map((item, index) => (
                <div key={index} className="list-item-hover" style={styles.listItem}>
                  <div style={styles.checkCircle}>
                    <CheckCircle2 size={16} color="#3b82f6" />
                  </div>
                  <span style={styles.listText}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#030712', paddingTop: '120px', paddingBottom: '80px', color: '#fff' },
  hero: { textAlign: 'center', marginBottom: '60px' },
  title: { fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: '900', marginBottom: '15px' },
  subtitle: { fontSize: '18px', color: '#94a3b8', fontWeight: '500' },
  content: { maxWidth: '1140px', margin: '0 auto', padding: '0 20px' },
  section: { marginBottom: '60px' },
  mainGlassCard: { 
    background: 'rgba(30, 41, 59, 0.3)', 
    backdropFilter: 'blur(12px)',
    padding: '60px 40px', 
    borderRadius: '40px', 
    border: '1px solid rgba(255, 255, 255, 0.05)', 
    textAlign: 'center',
    position: 'relative'
  },
  badge: { 
    display: 'inline-block', 
    padding: '6px 16px', 
    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    color: '#3b82f6', 
    borderRadius: '100px', 
    fontSize: '13px', 
    fontWeight: '700', 
    marginBottom: '20px', 
    border: '1px solid rgba(59, 130, 246, 0.2)' 
  },
  sectionTitle: { fontSize: '36px', fontWeight: '800', marginBottom: '20px', color: '#fff' },
  text: { fontSize: '18px', lineHeight: '1.8', color: '#94a3b8', maxWidth: '850px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '80px' },
  card: { 
    backgroundColor: 'rgba(30, 41, 59, 0.25)', 
    padding: '45px 30px', 
    borderRadius: '32px', 
    border: '1px solid rgba(255, 255, 255, 0.05)', 
    textAlign: 'center' 
  },
  iconWrapper: { 
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05))', 
    width: '75px', 
    height: '75px', 
    borderRadius: '22px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: '0 auto 30px', 
    color: '#3b82f6', 
    border: '1px solid rgba(59, 130, 246, 0.2)' 
  },
  cardTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '15px', color: '#fff' },
  cardText: { fontSize: '15px', color: '#94a3b8', lineHeight: '1.7' },
  listGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  listItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px', 
    background: 'rgba(30, 41, 59, 0.3)', 
    padding: '24px', 
    borderRadius: '22px', 
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer'
  },
  checkCircle: { 
    background: 'rgba(59, 130, 246, 0.1)', 
    width: '32px', 
    height: '32px', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  listText: { color: '#f8fafc', fontSize: '16px', fontWeight: '500' }
};

export default AboutUs;