import React from 'react';
import { Search } from 'lucide-react';
import './Header.css';

const Header = ({ onSearch, onLogout }) => {
  return (
    <div className="header">
      <h1>User Management</h1>
      <div className="header-right">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
