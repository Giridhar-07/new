import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBed, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartBar,
  FaCog,
  FaBars,
  FaSignOutAlt
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState({
    name: 'Admin User',
    role: 'Hotel Manager',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff'
  });
  const location = useLocation();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/user-profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: `${data.first_name} ${data.last_name}`,
            role: data.role || 'Hotel Staff',
            avatar: data.avatar || `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&background=3b82f6&color=fff`
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const isStaff = localStorage.getItem('is_staff') === 'true';

  const navigationItems = [
    {
      section: 'Main',
      items: [
        ...(isStaff ? [{ path: '/dashboard', icon: <FaHome />, text: 'Dashboard' }] : []),
        { path: '/rooms', icon: <FaBed />, text: 'Rooms' },
        { path: '/reservations', icon: <FaCalendarAlt />, text: 'Reservations' }
      ]
    },
    ...(isStaff ? [{
      section: 'Management',
      items: [
        { path: '/customers', icon: <FaUsers />, text: 'Customers' },
        { path: '/analytics', icon: <FaChartBar />, text: 'Analytics' },
        { path: '/settings', icon: <FaCog />, text: 'Settings' }
      ]
    }] : [])
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">LuxuryStay</h1>
        </div>

        <nav className="nav-menu">
          {navigationItems.map((section, idx) => (
            <div key={idx} className="nav-section">
              <div className="nav-section-title">{section.section}</div>
              {section.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="user-section">
          <div className="user-profile">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">{userData.name}</div>
              <div className="user-role">{userData.role}</div>
            </div>
          </div>
          <button 
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              setIsAuthenticated(false);
              window.location.href = '/login';
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
