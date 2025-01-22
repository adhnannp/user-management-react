import React, { useRef, useState } from 'react';
import { Camera, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './UserHome.css';
import default_avatar from '../../assets/default-avatar.jpg';
import { logout } from '../../features/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserHome = () => {
  const IMG_FILE_REF = "../../../../server/uploads";
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      try {
        setUploading(true);
        const response = await axios.post(
          `http://localhost:3000/user/upload-profile-picture/${user.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        toast.success('Profile picture updated successfully.');
        console.log('Response:', response.data);
      } catch (error) {
        console.log("userdata:",user)
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="profile-card">
        <button 
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </button>
        <div className="welcome-header">
          <h1 className="welcome-text">Welcome Back!</h1>
          <p className="welcome-subtext">We're glad to see you again</p>
        </div>

        <div className="profile-section">
          <div className="profile-image-container">
            <img
              src={`${IMG_FILE_REF}${user.profilePicture}` || default_avatar}
              alt={`${user.userName}'s profile`}
              className="profile-image"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden-input"
            />
            <button 
              className="change-image-btn"
              onClick={triggerFileInput}
            >
              <Camera size={16} />
              {uploading ? 'Uploading...' : 'Change Image'}
            </button>
          </div>
          <div className="profile-info">
            <h2 className="user-name">{user.userName}</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
