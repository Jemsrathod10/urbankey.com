import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from 'lucide-react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I list my property on UrbanKey?",
      answer: "Register as an Owner or Agent, login to your account, and click on 'Add Property'. Fill in all the details and submit for admin approval."
    },
    {
      question: "Is listing a property free?",
      answer: "Yes, basic property listing is completely free. We may offer premium features for better visibility in the future."
    },
    {
      question: "How long does it take for my property to get approved?",
      answer: "Properties are typically approved within 24-48 hours by our admin team after verification."
    },
    {
      question: "Can I edit my property listing after submission?",
      answer: "Yes, you can edit your property details anytime from the 'My Properties' section in your dashboard."
    },
    {
      question: "How do I contact property owners?",
      answer: "Click on any property to view details. You'll find the owner's contact information including phone and email on the property details page."
    },
    {
      question: "What types of properties can I list?",
      answer: "You can list residential properties (flats, houses, villas, plots) and commercial properties (offices, shops, warehouses)."
    },
    {
      question: "How do I delete my property listing?",
      answer: "Go to 'My Properties', find your listing, and click the delete button. Your property will be removed immediately."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <HelpCircle size={40} color="#3b82f6" />
          </div>
          <h1 style={styles.title}>Knowledge Base</h1>
          <p style={styles.subtitle}>Everything you need to know about UrbanKey</p>
        </div>

        {/* FAQ List */}
        <div style={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} style={{
                ...styles.faqItem,
                borderColor: isOpen ? '#3b82f6' : '#1f2937',
                backgroundColor: isOpen ? '#1e293b' : '#0f172a'
              }}>
                <button 
                  onClick={() => toggleFAQ(index)} 
                  style={styles.faqQuestion}
                >
                  <span style={{ color: isOpen ? '#3b82f6' : '#e5e7eb' }}>{faq.question}</span>
                  {isOpen ? <ChevronUp size={22} color="#3b82f6" /> : <ChevronDown size={22} color="#9ca3af" />}
                </button>
                <div style={{
                  ...styles.answerWrapper,
                  maxHeight: isOpen ? '200px' : '0',
                  opacity: isOpen ? 1 : 0,
                  paddingBottom: isOpen ? '20px' : '0'
                }}>
                  <div style={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Contact Section */}
        <div style={styles.footer}>
          <h3 style={styles.footerTitle}>Didn't find what you're looking for?</h3>
          <div style={styles.contactGrid}>
            <div style={styles.contactCard}>
               <Mail size={24} color="#3b82f6" />
               <div>
                  <div style={styles.contactLabel}>Email Us</div>
                  <div style={styles.contactValue}>support@urbankey.com</div>
               </div>
            </div>
            <div style={styles.contactCard}>
               <MessageCircle size={24} color="#10b981" />
               <div>
                  <div style={styles.contactLabel}>Live Chat</div>
                  <div style={styles.contactValue}>Mon-Fri, 9am - 6pm</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020617', padding: '60px 20px', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '50px' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  title: { fontSize: '38px', fontWeight: 'bold', marginBottom: '10px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '18px', color: '#94a3b8' },
  faqList: { maxWidth: '850px', margin: '0 auto 60px' },
  faqItem: { borderRadius: '16px', border: '1px solid', marginBottom: '16px', transition: 'all 0.3s ease', overflow: 'hidden' },
  faqQuestion: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', backgroundColor: 'transparent', border: 'none', fontSize: '18px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' },
  answerWrapper: { overflow: 'hidden', transition: 'all 0.4s ease-in-out', paddingLeft: '28px', paddingRight: '28px' },
  faqAnswer: { color: '#94a3b8', fontSize: '16px', lineHeight: '1.7' },
  footer: { maxWidth: '850px', margin: '0 auto', textAlign: 'center', padding: '40px', backgroundColor: '#1e293b', borderRadius: '24px', border: '1px solid #1f2937' },
  footerTitle: { fontSize: '22px', fontWeight: 'bold', marginBottom: '25px' },
  contactGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  contactCard: { display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#020617', padding: '15px 25px', borderRadius: '15px', border: '1px solid #1f2937', minWidth: '250px' },
  contactLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' },
  contactValue: { fontSize: '15px', color: '#e5e7eb', fontWeight: '500' }
};

export default FAQs;
