import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop'; 
import Home from './pages/Home';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterAgent from './pages/RegisterAgent'; 
import RegisterOwner from './pages/RegisterOwner'; 
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'; 
import AdminInquiries from './pages/AdminInquiries';
import UserManagement from './pages/AdminUserManagement'; 
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import GeneralTerms from './pages/GeneralTerms'; // Added import
import EditProperty from './pages/EditProperty'; 
import Messages from './pages/Messages';

import './App.css'; 
import './pages/Responsive.css'; 

function AppContent() {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  
  const isAdminPage = location.pathname === '/admin-dashboard' || 
                      location.pathname === '/admin-inquiries' ||
                      location.pathname === '/admin-users';

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#0f172a', 
        color: '#3b82f6' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: '#0f172a' 
    }}>
      {!isAdminPage && <Header />}
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListing />} />
          <Route path="/properties/buy" element={<PropertyListing purpose="Sell" />} />
          <Route path="/properties/rent" element={<PropertyListing purpose="Rent" />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-agent" element={<RegisterAgent />} /> 
          <Route path="/register-owner" element={<RegisterOwner />} /> 
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/terms" element={<GeneralTerms />} /> {/* Added route */}
          
          <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['owner', 'agent']}>
              <UserDashboard /> 
            </ProtectedRoute>
          } />

          <Route path="/add-property" element={
            <ProtectedRoute roles={['owner', 'agent', 'admin']}>
              <AddProperty />
            </ProtectedRoute>
          } />
          
          <Route path="/my-properties" element={
            <ProtectedRoute roles={['owner', 'agent']}>
              <MyProperties />
            </ProtectedRoute>
          } />
          
          <Route path="/edit-property/:id" element={
            <ProtectedRoute roles={['owner', 'agent', 'admin']}>
              <EditProperty />
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute roles={['owner', 'agent', 'customer']}>
              <Messages />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-inquiries" element={
            <ProtectedRoute roles={['admin']}>
              <AdminInquiries />
            </ProtectedRoute>
          } />

          <Route path="/admin-users" element={
            <ProtectedRoute roles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop /> 
      <AppContent />
    </AuthProvider>
  );
}

export default App;
