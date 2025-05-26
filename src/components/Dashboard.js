import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaCalendarCheck, FaUserFriends } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalBookings: data.total_bookings || 0,
            activeBookings: data.active_bookings || 0,
            revenue: data.total_revenue || 0,
          });
          setActivities(data.recent_activities || []);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  let dashboardContent;

  if (loading) {
    dashboardContent = (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Loading...</h1>
          </div>
        </div>
      </div>
    );
  } else if (error) {
    dashboardContent = (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Error</h1>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  } else {
    dashboardContent = (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Welcome Back</h1>
            <p className="dashboard-subtitle">
              Here's an overview of your hotel management statistics
            </p>
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-change positive">
                <span>↑ 12%</span> vs last month
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Active Bookings</div>
              <div className="stat-value">{stats.activeBookings}</div>
              <div className="stat-change positive">
                <span>↑ 8%</span> vs last month
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">${stats.revenue.toLocaleString()}</div>
              <div className="stat-change positive">
                <span>↑ 15%</span> vs last month
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'booking' ? (
                      <FaCalendarCheck />
                    ) : activity.type === 'check-in' ? (
                      <FaHotel />
                    ) : (
                      <FaUserFriends />
                    )}
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-time">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`activity-status status-${activity.status}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{dashboardContent}</>;
}

export default Dashboard;
