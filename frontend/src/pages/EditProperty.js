import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { Layout, IndianRupee, Save, ArrowLeft, Edit3, MapPin, Info } from 'lucide-react';
import Swal from 'sweetalert2';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [propertyData, setPropertyData] = useState(null); 
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await API.get(`/properties/${id}`);
                const p = data.property;
                setPropertyData(p); 
                setFormData({
                    title: p.title,
                    description: p.description,
                    price: p.price,
                });
                setLoading(false);
            } catch (error) {
                Swal.fire('Error', 'Property not found', 'error');
                navigate('/my-properties');
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price' && value < 0) {
            setFormData({ ...formData, [name]: 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.price < 0) {
            Swal.fire('Error', 'Price cannot be negative', 'error');
            return;
        }
        try {
            await API.put(`/properties/${id}`, formData);
            Swal.fire({
                title: 'Success!',
                text: 'Property updated successfully',
                icon: 'success',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#3b82f6'
            });
            navigate('/my-properties');
        } catch (error) {
            Swal.fire('Error', 'Failed to update', 'error');
        }
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p>Loading Property Details...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <div style={styles.header}>
                    <div style={styles.iconCircle}><Edit3 size={32} color="#3b82f6" /></div>
                    <h1 style={styles.title}>Edit <span style={styles.gradientText}>Listing</span></h1>
                    <p style={styles.subtitle}>Update your property details to keep buyers informed.</p>
                </div>

                <div style={styles.infoBanner}>
                    <Info size={18} />
                    <span>You can view all details, but you are only permitted to edit the Title, Price, and Description.</span>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.glassPanel}>
                        <h3 style={styles.panelTitle}><Layout size={20} color="#3b82f6" /> Fixed Details</h3>
                        <div style={styles.grid2}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Property Type</label>
                                <input value={propertyData.propertyType} style={styles.readOnlyInput} readOnly />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Purpose</label>
                                <input value={propertyData.purpose} style={styles.readOnlyInput} readOnly />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Location</label>
                            <div style={styles.readOnlyWrapper}>
                                <MapPin size={16} color="#64748b" />
                                <input value={`${propertyData.location.address}, ${propertyData.location.city}`} style={styles.readOnlyInputNoBorder} readOnly />
                            </div>
                        </div>
                    </div>

                    <div style={styles.glassPanel}>
                        <h3 style={styles.panelTitle}><Edit3 size={20} color="#10b981" /> Editable Content</h3>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Property Title *</label>
                            <input name="title" value={formData.title} onChange={handleChange} style={styles.input} required />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Price (₹) *</label>
                            <div style={styles.priceWrapper}>
                                <span style={styles.currencyIcon}><IndianRupee size={18}/></span>
                                <input type="number" name="price" min="0" value={formData.price} onChange={handleChange} style={styles.priceInput} required />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} style={{...styles.input, height: '140px'}} required />
                        </div>
                    </div>

                    <div style={styles.footerActions}>
                        <button type="button" onClick={() => navigate(-1)} style={styles.secondaryBtn}><ArrowLeft size={18}/> Back</button>
                        <button type="submit" style={styles.primaryBtn}><Save size={18} /> Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#020617', padding: '100px 20px', backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)' },
    formWrapper: { maxWidth: '800px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '40px' },
    iconCircle: { width: '80px', height: '80px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(59, 130, 246, 0.2)' },
    title: { color: '#f8fafc', fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px' },
    gradientText: { background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: '#94a3b8', fontSize: '18px', marginTop: '10px' },
    infoBanner: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6', padding: '15px 25px', borderRadius: '16px', marginBottom: '30px', fontSize: '14px', border: '1px solid rgba(59, 130, 246, 0.2)' },
    form: { display: 'flex', flexDirection: 'column', gap: '30px' },
    glassPanel: { background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(16px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    panelTitle: { color: '#f8fafc', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
    label: { color: '#94a3b8', fontSize: '13px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
    input: { backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#fff', padding: '18px', borderRadius: '20px', fontSize: '15px', outline: 'none' },
    readOnlyInput: { width: '100%', padding: '18px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', color: '#64748b', cursor: 'not-allowed' },
    readOnlyWrapper: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '0 18px' },
    readOnlyInputNoBorder: { width: '100%', padding: '18px 0', background: 'none', border: 'none', color: '#64748b', outline: 'none', cursor: 'not-allowed' },
    priceWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    currencyIcon: { position: 'absolute', left: '20px', color: '#10b981' },
    priceInput: { width: '100%', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '18px 18px 18px 45px', borderRadius: '20px', fontSize: '22px', fontWeight: '800', outline: 'none' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
    footerActions: { display: 'flex', gap: '20px', justifyContent: 'flex-end', marginTop: '10px' },
    secondaryBtn: { padding: '18px 40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    primaryBtn: { padding: '18px 50px', borderRadius: '20px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)' },
    loadingContainer: { minHeight: '100vh', backgroundColor: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    loader: { border: '4px solid #1e293b', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px' }
};

export default EditProperty;
