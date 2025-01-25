import React, { useState, useEffect } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, userLogin } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UserLogin.css';
import { validateAuthForm } from '../../utils/loginValidation';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, isAdmin, authToken } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated && authToken && !isAdmin) {
      navigate('/home');
    }
  }, [isAuthenticated, authToken, navigate, isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAuthForm(formData, isLogin);

    if (Object.keys(validationErrors).length > 0) {
      for (let field in validationErrors) {
        toast.error(validationErrors[field]);
      }
      return;
    }

    if (isLogin) {
      dispatch(userLogin({ email: formData.email, password: formData.password }));
    } else {
      dispatch(
        registerUser({
          userName: formData.username,
          email: formData.email,
          password: formData.password,
        })
      );
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <div className="header">
          <h1 className="title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="subtitle">
            {isLogin ? 'Please enter your details to sign in' : 'Please fill in the information below'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <div className="input-group">
              <User className="icon" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="input"
                required={!isLogin}
              />
            </div>
          )}
          <div className="input-group">
            <Mail className="icon" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="input"
              required
            />
          </div>
          <div className="input-group">
            <Lock className="icon" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input"
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {isLogin ? (loading ? 'Signing In...' : 'Sign In') : loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        <div className="footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-button"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;