import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Upload, MapPin, Info, List, X, Image as ImageIcon, CheckCircle2, Building2, Layout, IndianRupee } from 'lucide-react';
import Swal from 'sweetalert2';

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Flat',
    purpose: 'Sell',
    price: '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnishing: 'Unfurnished',
    parking: '',
    floor: '',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || ''
  });

  const showBHK = ['Flat', 'House', 'Villa', 'Farmhouse'].includes(formData.propertyType);
  const showBathrooms = ['Flat', 'House', 'Villa', 'Office', 'Shop', 'Farmhouse'].includes(formData.propertyType);
  const showFurnishing = ['Flat', 'House', 'Villa', 'Office', 'Shop', 'Warehouse'].includes(formData.propertyType);
  const showFloor = ['Flat', 'Office', 'Shop', 'Warehouse'].includes(formData.propertyType);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number' && value < 0) {
      setFormData({ ...formData, [name]: 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = preview.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreview(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.price) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Price must be greater than 0.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (images.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Images Required',
          text: 'Please upload at least one image of the property.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
        return;
    }

    setLoading(true);
    Swal.fire({
      title: 'Publishing Property...',
      text: 'Please wait while we list your property.',
      allowOutsideClick: false,
      background: '#0f172a',
      color: '#fff',
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('propertyType', formData.propertyType);
      data.append('purpose', formData.purpose);
      data.append('price', formData.price);
      data.append('location', JSON.stringify({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }));
      data.append('specifications', JSON.stringify({
        bedrooms: showBHK ? (parseInt(formData.bedrooms) || 0) : 0,
        bathrooms: showBathrooms ? (parseInt(formData.bathrooms) || 0) : 0,
        area: parseInt(formData.area) || 0,
        furnishing: showFurnishing ? formData.furnishing : 'Not Applicable',
        parking: parseInt(formData.parking) || 0,
        floor: showFloor ? (parseInt(formData.floor) || 0) : 0
      }));
      data.append('contact', JSON.stringify({
        name: formData.contactName,
        phone: formData.contactPhone,
        email: formData.contactEmail
      }));
      images.forEach(img => { data.append('images', img); });

      const response = await API.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if(response.data) {
          Swal.fire({
            title: 'Success!',
            text: 'Property has been listed successfully!',
            icon: 'success',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#10b981',
            timer: 2500
          });
          navigate('/my-properties');
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Occurred',
        text: error.response?.data?.message || 'Failed to add property.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.header}>
          <div style={styles.iconCircle}><Plus size={32} color="#3b82f6" /></div>
          <h1 style={styles.title}>List New <span style={styles.gradientText}>Property</span></h1>
          <p style={styles.subtitle}>Fill in the details below to showcase your property.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.glassPanel}>
            <h3 style={styles.panelTitle}><Info size={20} color="#3b82f6" /> Basic Information</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Property Title *</label>
              <input type="text" name="title" style={styles.input} placeholder="e.g., 3 BHK Luxury Flat in Adajan" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div style={styles.grid2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Property Type *</label>
                <select name="propertyType" style={styles.input} value={formData.propertyType} onChange={handleInputChange} required>
                  <option value="Flat">🏢 Flat / Apartment</option>
                  <option value="House">🏠 House / Bungalow</option>
                  <option value="Villa">🏘️ Villa</option>
                  <option value="Plot">🏞️ Plot / Land</option>
                  <option value="Office">💼 Office Space</option>
                  <option value="Shop">🏪 Shop / Showroom</option>
                  <option value="Warehouse">📦 Warehouse</option>
                  <option value="Farmhouse">🚜 Farmhouse</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Purpose *</label>
                <select name="purpose" style={styles.input} value={formData.purpose} onChange={handleInputChange} required>
                  <option value="Sell">💰 Sell</option>
                  <option value="Rent">🔑 Rent</option>
                  <option value="Lease">📄 Lease</option>
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Total Price (₹) *</label>
              <div style={styles.priceWrapper}>
                <span style={styles.currencyIcon}><IndianRupee size={18}/></span>
                <input type="number" name="price" min="0" style={styles.priceInput} placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Description *</label>
              <textarea name="description" style={{...styles.input, minHeight: '120px'}} placeholder="What makes this property special?" value={formData.description} onChange={handleInputChange} required />
            </div>
          </div>

          <div style={styles.glassPanel}>
            <h3 style={styles.panelTitle}><MapPin size={20} color="#10b981" /> Location Details</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Street Address *</label>
              <input type="text" name="address" style={styles.input} placeholder="House no, Street name, Area" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div style={styles.grid3}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City *</label>
                <input type="text" name="city" style={styles.input} value={formData.city} onChange={handleInputChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State *</label>
                <input type="text" name="state" style={styles.input} value={formData.state} onChange={handleInputChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pincode *</label>
                <input type="text" name="pincode" style={styles.input} value={formData.pincode} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div style={styles.glassPanel}>
            <h3 style={styles.panelTitle}><List size={20} color="#f59e0b" /> Specifications</h3>
            <div style={styles.grid3}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Area (sq.ft) *</label>
                <input type="number" name="area" min="0" style={styles.input} value={formData.area} onChange={handleInputChange} required />
              </div>
              {showBHK && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bedrooms</label>
                  <input type="number" name="bedrooms" min="0" style={styles.input} value={formData.bedrooms} onChange={handleInputChange} />
                </div>
              )}
              {showBathrooms && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bathrooms</label>
                  <input type="number" name="bathrooms" min="0" style={styles.input} value={formData.bathrooms} onChange={handleInputChange} />
                </div>
              )}
            </div>
          </div>

          <div style={styles.glassPanel}>
            <h3 style={styles.panelTitle}><ImageIcon size={20} color="#ec4899" /> Visual Showcase</h3>
            <div style={styles.uploadZone}>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{display: 'none'}} id="upload-main" />
                <label htmlFor="upload-main" style={styles.uploadLabel}>
                    <div style={styles.uploadIcon}><Upload size={28} color="#fff" /></div>
                    <span style={{fontSize: '16px', fontWeight: '700', color: '#fff'}}>Drag or Click to Upload</span>
                    <span style={{fontSize: '12px', color: '#64748b', marginTop: '5px'}}>High quality photos get 5x more leads</span>
                </label>
            </div>
            {preview.length > 0 && (
                <div style={styles.previewContainer}>
                    {preview.map((url, index) => (
                        <div key={index} style={styles.imageBox}>
                            <img src={url} alt="prop" style={styles.fullImg} />
                            <button type="button" onClick={() => removeImage(index)} style={styles.removeBtn}><X size={12} /></button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div style={styles.footerActions}>
            <button type="button" onClick={() => navigate(-1)} style={styles.secondaryBtn}>Discard</button>
            <button type="submit" style={styles.primaryBtn} disabled={loading}>
              {loading ? 'Publishing...' : <><CheckCircle2 size={18} /> Publish Listing</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#020617', padding: '100px 20px', backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)' },
  formWrapper: { maxWidth: '850px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '60px' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(59, 130, 246, 0.2)' },
  title: { color: '#f8fafc', fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px' },
  gradientText: { background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#94a3b8', fontSize: '18px', marginTop: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '40px' },
  glassPanel: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(16px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  panelTitle: { color: '#f8fafc', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '25px' },
  label: { color: '#94a3b8', fontSize: '13px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '18px', borderRadius: '20px', fontSize: '15px', outline: 'none', transition: '0.3s' },
  priceWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  currencyIcon: { position: 'absolute', left: '20px', color: '#10b981' },
  priceInput: { width: '100%', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '18px 18px 18px 45px', borderRadius: '20px', fontSize: '22px', fontWeight: '800', outline: 'none' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' },
  uploadZone: { border: '2px dashed rgba(59, 130, 246, 0.3)', borderRadius: '28px', padding: '60px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'rgba(59, 130, 246, 0.02)', transition: '0.3s' },
  uploadIcon: { width: '64px', height: '64px', backgroundColor: '#3b82f6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' },
  uploadLabel: { cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  previewContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', marginTop: '30px' },
  imageBox: { position: 'relative', height: '140px', borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' },
  fullImg: { width: '100%', height: '100%', objectFit: 'cover' },
  removeBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  footerActions: { display: 'flex', gap: '20px', justifyContent: 'flex-end', marginTop: '20px' },
  secondaryBtn: { padding: '18px 40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' },
  primaryBtn: { padding: '18px 50px', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)' }
};

export default AddProperty;
