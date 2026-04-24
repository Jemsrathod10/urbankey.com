import React, { useEffect, useState, useContext, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, User, ArrowLeft, Info, ShieldCheck, ChevronLeft, ChevronRight, MessageCircle, Share2, PlayCircle, Star, FileText, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import EMICalculator from '../components/EMICalculator';
import ChatWindow from '../components/ChatWindow';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const [showChat, setShowChat] = useState(false);

  const brochureRef = useRef();

  // Dynamic IP Logic
  const getBaseUrl = () => {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
  };
  const BASE_URL = getBaseUrl();

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchReviews(); 
      if (user) checkFavorite();
    }
  }, [id, user]);

  const fetchProperty = async () => {
    try {
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data.property);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${id}`);
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkFavorite = async () => {
    try {
      const { data } = await API.get('/favorites');
      setIsFavorite(data.favorites.some(f => f.property._id === id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to save favorites',
        icon: 'warning',
        background: '#151a35',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await API.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await API.post(`/favorites/${id}`);
        setIsFavorite(true);
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#151a35',
          color: '#fff'
        });
        Toast.fire({ icon: 'success', title: 'Added to favorites' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleWhatsApp = () => {
    if(!user) return loginAlert();
    const phone = property.contact?.phone || property.owner?.phone;
    const message = `Hello, I'm interested in your property: ${property.title}. Link: ${window.location.href}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({ title: 'Link Copied!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#151a35', color: '#fff' });
    }
  };

  const loginAlert = () => {
    Swal.fire({
      title: 'Login Required',
      text: 'Please login to access this feature',
      icon: 'info',
      background: '#151a35',
      color: '#fff',
      confirmButtonColor: '#3b82f6'
    }).then(() => navigate('/login'));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return loginAlert();

    setSubmitting(true);
    try {
      await API.post(`/reviews/${id}`, newReview);
      Swal.fire({ title: 'Review Added!', icon: 'success', timer: 1500, showConfirmButton: false, background: '#151a35', color: '#fff' });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews(); 
    } catch (error) {
      Swal.fire({ 
        title: 'Error', 
        text: error.response?.data?.message || 'Failed to add review', 
        icon: 'error',
        background: '#151a35',
        color: '#fff'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChatOpen = () => {
    if (!user) return loginAlert();
    setShowChat(true);
  };

  const downloadBrochure = async () => {
    if (!user) {
      Swal.fire({ title: 'Login Required', text: 'Please login to download brochure', icon: 'info', background: '#ffffff', color: '#333' });
      return;
    }

    Swal.fire({
      title: 'Generating PDF...',
      text: 'Organizing layout for Overview',
      didOpen: () => { Swal.showLoading(); },
      background: '#1a1a1a', color: '#fff'
    });

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const agentEmail = String(property.owner?.email || property.contact?.email || user?.email || "N/A");
      const agentPhone = String(property.owner?.phone || property.contact?.phone || user?.phone || "N/A");
      const agentName = String(property.owner?.name || property.contact?.name || user?.name || "Premium Manager");

      const addr = property.location?.address || '';
      const city = property.location?.city || '';
      const state = property.location?.state || '';
      const pin = property.location?.pincode || '';
      const fullAddress = String(`${addr}, ${city}, ${state} ${pin}`).replace(/^, |, $/g, '').trim() || "Location details not provided";

      const midnightBlack = [15, 23, 42]; 
      const metallicGold = [184, 134, 11];

      pdf.setFillColor(...midnightBlack);
      pdf.rect(0, 0, pageWidth, 65, 'F'); 
      pdf.setDrawColor(...metallicGold);
      pdf.setLineWidth(1.5);
      pdf.line(0, 5, pageWidth, 5); 

      try {
        const logoW = 85; 
        const logoH = 40; 
        const logoX = (pageWidth - logoW) / 2;
        const logoY = 8; 
        pdf.addImage('/logo1.png', 'PNG', logoX, logoY, logoW, logoH);
      } catch (e) {
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(32);
        pdf.text("URBANKEY", pageWidth / 2, 30, { align: 'center' });
      }

      try {
        const currentUrl = window.location.href;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}&color=ffffff&bgcolor=0f172a`;
        
        const loadQR = () => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = qrCodeUrl;
          });
        };

        const qrImg = await loadQR();
        pdf.addImage(qrImg, 'PNG', pageWidth - 38, 12, 22, 22);
        
        pdf.setFontSize(6);
        pdf.setTextColor(180, 180, 180);
        pdf.text("SCAN TO VIEW ONLINE", pageWidth - 27, 38, { align: 'center' });
      } catch (e) {
        console.warn("QR generation failed");
      }

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(200, 200, 200);
      pdf.text("Discover Your Dream Space with Excellence", pageWidth / 2, 52, { align: 'center' });

      // FIX: PDF Image with Dynamic IP Support
      const mainImgElement = document.getElementById('main-property-image');
      if (mainImgElement) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = mainImgElement.naturalWidth;
          canvas.height = mainImgElement.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(mainImgElement, 0, 0);
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          
          pdf.setDrawColor(...metallicGold);
          pdf.setLineWidth(0.5);
          pdf.rect(14.5, 71.5, 181, 86); 
          pdf.addImage(imgData, 'JPEG', 15, 72, 180, 85);
        } catch (e) { 
          console.warn("Image capture skipped.", e); 
        }
      }

      let contentY = 172; 
      pdf.setTextColor(...midnightBlack);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(property.title || "Property Details").toUpperCase(), 15, contentY);

      pdf.setTextColor(...metallicGold);
      pdf.setFontSize(15);
      
      const formatPricePDF = (num) => {
        if (!num) return "Price on Request";
        if (num >= 10000000) return `Rs. ${(num / 10000000).toFixed(2)} Cr`;
        if (num >= 100000) return `Rs. ${(num / 100000).toFixed(2)} Lakh`;
        return `Rs. ${num.toLocaleString('en-IN')}`;
      };
      
      pdf.text(formatPricePDF(property.price), pageWidth - 15, contentY, { align: 'right' });

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 100, 100);
      const splitAddr = pdf.splitTextToSize(fullAddress, 180);
      pdf.text(splitAddr, 15, contentY + 7);

      let tableY = contentY + 16; 
      pdf.setFillColor(255, 252, 240); 
      pdf.rect(15, tableY, 180, 40, 'F'); 

      const specs = [
        ["BHK", String(property.specifications?.bedrooms || '0') + " BHK"],
        ["Area", String(property.specifications?.area || '0') + " Sq.Ft"],
        ["Type", String(property.propertyType || "N/A")],
        ["Parking", String(property.specifications?.parking || '0') + " Slots"],
        ["Bath", String(property.specifications?.bathrooms || '0') + " Units"],
        ["Status", String(property.purpose || "N/A")]
      ];

      pdf.setFontSize(9);
      specs.forEach((item, i) => {
        const x = i % 2 === 0 ? 25 : 110;
        const y = tableY + 10 + (Math.floor(i / 2) * 10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...metallicGold);
        pdf.text(String(item[0]).toUpperCase() + " :", x, y); 
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...midnightBlack);
        pdf.text(String(item[1]), x + 30, y); 
      });

      let descY = tableY + 50; 
      const availableSpace = (pageHeight - 40) - descY; 
      
      pdf.setTextColor(...midnightBlack);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "bold");
      pdf.text("OVERVIEW", 15, descY);
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      
      const desc = pdf.splitTextToSize(String(property.description || ""), 180);
      const maxLines = Math.floor(availableSpace / 5); 
      const finalDesc = desc.length > maxLines ? desc.slice(0, maxLines) : desc;
      
      pdf.text(finalDesc, 15, descY + 7);

      pdf.setFillColor(...midnightBlack);
      pdf.rect(0, pageHeight - 35, pageWidth, 35, 'F');
      pdf.setTextColor(...metallicGold);
      pdf.setFontSize(11);
      pdf.text("CONTACT DETAILS:", 15, pageHeight - 20);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`Manager: ${agentName}`, 15, pageHeight - 12);
      pdf.text(`Email: ${agentEmail}`, pageWidth - 15, pageHeight - 20, { align: 'right' });
      pdf.text(`Call: +91 ${agentPhone}`, pageWidth - 15, pageHeight - 12, { align: 'right' });

      pdf.save(`UrbanKey_Brochure_${property.title}.pdf`);
      Swal.fire({ icon: 'success', title: 'PDF Ready!', background: '#1a1a1a', color: '#fff', timer: 1500 });

    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to generate PDF.' });
    }
  };

  if (loading) return <div style={styles.loading}><div className="spinner"></div><p>Fetching property details...</p></div>;
  if (!property) return <div style={styles.loading}><h2>Property not found</h2><button onClick={() => navigate('/properties')}>Go Back</button></div>;

  const allImages = property.images && property.images.length > 0 
    ? property.images.map(img => img.startsWith('http') ? img : `${BASE_URL}/uploads/${img}`)
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'];

  const nextImage = () => setActiveImage((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);

  const ownerPhone = property.contact?.phone || property.owner?.phone || 'No Number';
  const ownerEmail = property.contact?.email || property.owner?.email || 'No Email';

  const formattedDisplayPrice = property.price >= 10000000 
    ? `₹ ${(property.price / 10000000).toFixed(2)} Cr` 
    : property.price >= 100000 
      ? `₹ ${(property.price / 100000).toFixed(2)} Lakh` 
      : `₹ ${property.price.toLocaleString('en-IN')}`;

  return (
    <div style={styles.container}>
      <div className="container" style={styles.innerContainer}>
        <div style={styles.topActions}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} /> <span className="hide-mobile">Go Back</span>
          </button>
          
          <button onClick={downloadBrochure} style={styles.pdfBtn}>
            <FileText size={20} /> <span className="hide-mobile">Download Brochure</span>
          </button>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftColumn} ref={brochureRef}>
            <div style={styles.gallerySection}>
              <div style={styles.mainImageWrapper}>
                <img 
                   id="main-property-image"
                   src={allImages[activeImage]} 
                   alt={property.title} 
                   style={styles.mainImage} 
                   crossOrigin="anonymous" 
                   loading="eager"
                   onError={(e) => { 
                     e.target.onerror = null; 
                     e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'; 
                   }}
                />
                {allImages.length > 1 && (
                  <>
                    <button onClick={prevImage} style={styles.navBtnLeft}><ChevronLeft size={24} /></button>
                    <button onClick={nextImage} style={styles.navBtnRight}><ChevronRight size={24} /></button>
                  </>
                )}
                <div style={styles.imageOverlay}>
                  <span style={styles.purposeBadge}>{property.purpose}</span>
                  {property.featured && <span style={styles.featuredBadge}>Featured</span>}
                </div>
              </div>

              {allImages.length > 1 && (
                <div style={styles.thumbnailGrid}>
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      style={{
                        ...styles.thumbnailWrapper, 
                        border: activeImage === idx ? '2px solid #3b82f6' : '2px solid transparent'
                      }}
                    >
                      <img 
                        src={img} 
                        alt="thumb" 
                        style={styles.thumbImg} 
                        crossOrigin="anonymous" 
                        loading="lazy"
                        onError={(e) => { 
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'; 
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.infoCard}>
              <div style={styles.titleSection}>
                <h1 style={styles.title}>{property.title}</h1>
                <div style={styles.priceContainer}>
                    <span style={styles.priceLabel}>Price</span>
                    <div style={styles.priceValue}>
                      {user ? formattedDisplayPrice : "₹ **** (Login to view)"}
                    </div>
                </div>
              </div>

              <div style={styles.actionBar}>
                <button onClick={handleWhatsApp} style={styles.whatsappBtn}>
                  <MessageCircle size={20} /> <span className="hide-mobile">WhatsApp</span>
                </button>
                <button onClick={handleChatOpen} style={styles.chatActionBtn}>
                  <MessageCircle size={20} /> <span className="hide-mobile">Chat</span>
                </button>
                <button onClick={handleShare} style={styles.shareBtn}>
                  <Share2 size={20} /> <span className="hide-mobile">Share</span>
                </button>
              </div>

              <div style={styles.locationInfo}>
                <MapPin size={20} color="#3b82f6" />
                <span>
                  {user ? `${property.location.address}, ${property.location.city}` : `${property.location.city} (Login to see full address)`}
                </span>
              </div>

              <div style={styles.specsGrid}>
                <div style={styles.specBox}>
                  <Bed color="#3b82f6" />
                  <div>
                    <div style={styles.specLabel}>Bedrooms</div>
                    <div style={styles.specValueText}>{property.specifications.bedrooms} BHK</div>
                  </div>
                </div>
                <div style={styles.specBox}>
                  <Bath color="#10b981" />
                  <div>
                    <div style={styles.specLabel}>Bathrooms</div>
                    <div style={styles.specValueText}>{property.specifications.bathrooms}</div>
                  </div>
                </div>
                <div style={styles.specBox}>
                  <Square color="#f59e0b" />
                  <div>
                    <div style={styles.specLabel}>Total Area</div>
                    <div style={styles.specValueText}>{property.specifications.area} sqft</div>
                  </div>
                </div>
              </div>

              {property.videoURL && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}><PlayCircle size={20} /> Virtual Tour (Video)</h3>
                  <div style={styles.videoWrapper}>
                    <iframe 
                      width="100%" 
                      className="responsive-iframe"
                      style={{ border: 'none', height: 'auto', minHeight: '250px', aspectRatio: '16/9' }}
                      src={`https://www.youtube.com/embed/${property.videoURL.includes('v=') ? property.videoURL.split('v=')[1] : property.videoURL.split('/').pop()}`} 
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}><Info size={20} /> Property Description</h3>
                <p style={styles.descriptionText}>{property.description}</p>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Key Details</h3>
                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}><span style={styles.dLabel}>Property Type</span><span style={styles.dValue}>{property.propertyType}</span></div>
                  <div style={styles.detailItem}><span style={styles.dLabel}>Furnishing</span><span style={styles.dValue}>{property.specifications.furnishing}</span></div>
                  <div style={styles.detailItem}><span style={styles.dLabel}>Parking</span><span style={styles.dValue}>{property.specifications.parking} Slots</span></div>
                  <div style={styles.detailItem}><span style={styles.dLabel}>Floor</span><span style={styles.dValue}>{property.specifications.floor || 'Ground'}</span></div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}><MessageCircle size={20} /> User Reviews & Ratings</h3>
                {user ? (
                  <>
                  <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Rating</label>
                      <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: e.target.value})} style={styles.reviewInput}>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                    </div>
                    <textarea placeholder="Share your thoughts..." value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required style={{ ...styles.reviewInput, height: '100px', resize: 'none' }} />
                    <button type="submit" disabled={submitting} style={styles.submitReviewBtn}>{submitting ? 'Posting...' : 'Post Review'}</button>
                  </form>
                  <div style={styles.reviewList}>
                  {reviews.length > 0 ? reviews.map((rev) => (
                    <div key={rev._id} style={styles.reviewItem}>
                      <div style={styles.reviewHeader}>
                        <div style={styles.reviewUser}>
                          <div style={styles.userAvatar}>{rev.user?.name.charAt(0)}</div>
                          <span>{rev.user?.name}</span>
                        </div>
                        <div style={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? "#f59e0b" : "none"} color={i < rev.rating ? "#f59e0b" : "#334155"} />
                          ))}
                        </div>
                      </div>
                      <p style={styles.reviewComment}>{rev.comment}</p>
                      <div style={styles.reviewDate}>{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                  )) : <p style={{ color: '#64748b', textAlign: 'center' }}>No reviews yet.</p>}
                </div>
                </>
                ) : (
                  <div style={styles.loginNote}>
                    <Lock size={18} /> Please <span onClick={() => navigate('/login')} style={{color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline'}}>login</span> to view and write reviews.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.stickySidebar}>
              <div style={styles.contactCard}>
                <h3 style={styles.sidebarTitle}>Contact Owner</h3>
                <div style={styles.ownerProfile}>
                  <div style={styles.avatar}><User size={24} color="#fff" /></div>
                  <div>
                    <div style={styles.ownerName}>{property.contact?.name || property.owner?.name}</div>
                    <div style={styles.ownerStatus}>Verified Owner</div>
                  </div>
                </div>
                <div style={{...styles.contactMethods, opacity: user ? 1 : 0.5, pointerEvents: user ? 'auto' : 'none'}}>
                  <a href={user ? `tel:${ownerPhone}` : '#'} style={styles.callBtn}><Phone size={18} /> {user ? ownerPhone : "XXXXXX-XXXX"}</a>
                  <a href={user ? `mailto:${ownerEmail}` : '#'} style={styles.mailBtn}><Mail size={18} /> Contact via Email</a>
                  <button onClick={handleChatOpen} style={styles.sidebarChatBtn}><MessageCircle size={18} /> Chat Privately</button>
                </div>
                {!user && <p style={{color: '#ef4444', fontSize: '11px', textAlign: 'center', marginBottom: '10px'}}>Login to access contact info</p>}
                
                <button onClick={handleFavorite} style={{...styles.favBtn, borderColor: isFavorite ? '#ef4444' : '#334155'}}>
                  <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#fff'} />
                  {isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
                </button>
                <div style={styles.securityNote}><ShieldCheck size={14} color="#10b981" /> Verify docs before paying.</div>
              </div>
              <div style={styles.sidebarEmi}>
                <EMICalculator initialPrice={property.price} />
              </div>
              <div style={styles.safetyCard}>
                <h4 style={{color: '#fff', marginBottom: '10px'}}>Interested?</h4>
                <p style={{color: '#94a3b8', fontSize: '13px'}}>Schedule a visit with the owner to see the property in person.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChat && <ChatWindow receiverId={property.owner?._id} receiverName={property.contact?.name || property.owner?.name} onClose={() => setShowChat(false)} />}
      
      <style>{`
        @media (max-width: 1024px) {
          .container { width: 95% !important; }
          div[style*="gridTemplateColumns: 1fr 400px"] { 
            grid-template-columns: 1fr !important; 
          }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          div[style*="fontSize: 36px"] { font-size: 24px !important; }
          div[style*="height: 550px"] { height: 350px !important; }
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] { 
            grid-template-columns: 1fr !important; 
          }
          div[style*="gridTemplateColumns: 1fr 1fr"] { 
            grid-template-columns: 1fr !important; 
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#020617', minHeight: '100vh', padding: '40px 0', color: '#f8fafc' },
  innerContainer: { maxWidth: '1250px', margin: '0 auto', padding: '0 20px' },
  loading: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', gap: '20px' },
  topActions: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'rgba(30, 41, 59, 0.5)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.3s' },
  pdfBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '35px' },
  leftColumn: { minWidth: 0 }, 
  gallerySection: { marginBottom: '30px' },
  mainImageWrapper: { position: 'relative', borderRadius: '28px', overflow: 'hidden', height: '550px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0f172a', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover' },
  navBtnLeft: { position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: '#fff', padding: '12px', cursor: 'pointer', zIndex: 10 },
  navBtnRight: { position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: '#fff', padding: '12px', cursor: 'pointer', zIndex: 10 },
  imageOverlay: { position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '10px', zIndex: 5 },
  purposeBadge: { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', padding: '8px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase' },
  featuredBadge: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', padding: '8px 18px', borderRadius: '10px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase' },
  thumbnailGrid: { display: 'flex', gap: '12px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' },
  thumbnailWrapper: { width: '110px', height: '80px', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: '2px solid transparent' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  infoCard: { backgroundColor: '#0f172a', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  titleSection: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' },
  title: { fontSize: '36px', fontWeight: '800', color: '#fff' },
  priceContainer: { marginBottom: '30px', padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '20px', borderLeft: '4px solid #3b82f6' },
  priceLabel: { display: 'block', color: '#94a3b8', fontSize: '14px', fontWeight: '600' },
  priceValue: { fontSize: '32px', fontWeight: '900', color: '#fff' },
  actionBar: { display: 'flex', gap: '15px', marginBottom: '35px', flexWrap: 'wrap' },
  whatsappBtn: { flex: 1, minWidth: '140px', backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  chatActionBtn: { flex: 1, minWidth: '140px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  shareBtn: { padding: '14px 24px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  locationInfo: { display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '16px' },
  specsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  specBox: { backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' },
  specLabel: { color: '#64748b', fontSize: '13px', fontWeight: '600' },
  specValueText: { color: '#fff', fontSize: '18px', fontWeight: 'bold' },
  videoWrapper: { borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', width: '100%', marginTop: '20px' },
  section: { marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' },
  descriptionText: { color: '#94a3b8', lineHeight: '1.8', fontSize: '16px' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  detailItem: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' },
  dLabel: { color: '#64748b', fontSize: '14px', fontWeight: '500' },
  dValue: { color: '#fff', fontWeight: '700', fontSize: '14px' },
  rightColumn: { position: 'relative' },
  stickySidebar: { position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '20px' },
  contactCard: { backgroundColor: '#0f172a', padding: '35px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)' },
  sidebarTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '25px' },
  ownerProfile: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ownerName: { color: '#fff', fontWeight: 'bold', fontSize: '18px' },
  ownerStatus: { color: '#10b981', fontSize: '12px' },
  contactMethods: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  callBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', textDecoration: 'none' },
  mailBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', textDecoration: 'none' },
  sidebarChatBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', fontWeight: 'bold', cursor: 'pointer' },
  favBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' },
  securityNote: { marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '11px', justifyContent: 'center' },
  safetyCard: { padding: '25px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' },
  reviewForm: { marginBottom: '30px' },
  reviewInput: { width: '100%', padding: '12px 15px', borderRadius: '12px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', marginBottom: '15px' },
  submitReviewBtn: { padding: '12px 24px', borderRadius: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  reviewItem: { padding: '20px', backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  reviewUser: { display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  reviewStars: { display: 'flex', gap: '2px' },
  reviewComment: { color: '#94a3b8', fontSize: '14px' },
  reviewDate: { color: '#64748b', fontSize: '11px', marginTop: '10px' },
  loginNote: { padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }
};

export default PropertyDetails;
