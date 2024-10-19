
import React from 'react';
import './Sidebar.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const menuItems = [
    { path: '/dashboard', icon: <FaHome className="sidebar-icon" />, label: 'Dashboard' },
    { path: '/create-interview', icon: <FaCalendar className="sidebar-icon"/>, label: 'Interviews' },
  ];

  return (
    <div className="sidebar">
      {menuItems.map(item => (
        <div
          key={item.path}
          className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.icon }
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
