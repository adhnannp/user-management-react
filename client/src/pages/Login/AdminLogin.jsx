import React, { useState, useEffect } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { validateAuthForm } from '../../utils/loginValidation';
import './AdminLogin.css';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    const validationErrors = validateAuthForm(formData, true);
    if (Object.keys(validationErrors).length > 0) {
      for (let field in validationErrors) {
        toast.error(validationErrors[field]);
      }
      return;
    }
    dispatch(adminLogin({ email: formData.email, password: formData.password }));
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin-panel');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="admin-login-container">
      <div className="admin-form-card">
        <div className="admin-logo">
          <Shield size={32} />
          <div>Admin Portal</div>
        </div>

        <div className="admin-header">
          <h1 className="admin-title">Admin Login</h1>
          <p className="admin-subtitle">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-input-group">
            <Mail className="admin-icon" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Admin Email"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-input-group">
            <Lock className="admin-icon" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="admin-input"
              required
            />
          </div>

          <button type="submit" className="admin-submit-button" disabled={loading}>
            {loading ? 'Logging In...' : 'Login to Admin Panel'}
          </button>

          {error && <p className="admin-error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
