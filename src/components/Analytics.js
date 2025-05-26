import React, { useState, useEffect } from 'react';
import {
  FaChartLine,
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaSpinner
} from 'react-icons/fa';
import './Analytics.css';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/dashboard/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-indicator">
          <FaSpinner className="spinner" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        {/* Total Bookings */}
        <div className="analytics-card">
          <div className="card-icon bookings">
            <FaCalendarCheck />
          </div>
          <div className="card-content">
            <h3>Total Bookings</h3>
            <p className="card-value">{analyticsData?.total_bookings || 0}</p>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="analytics-card">
          <div className="card-icon active">
            <FaBed />
          </div>
          <div className="card-content">
            <h3>Active Bookings</h3>
            <p className="card-value">{analyticsData?.active_bookings || 0}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="analytics-card">
          <div className="card-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="card-value">
              ${analyticsData?.total_revenue?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {analyticsData?.recent_activities?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <FaChartLine />
              </div>
              <div className="activity-details">
                <p className="activity-title">{activity.title}</p>
                <p className="activity-meta">
                  {new Date(activity.timestamp).toLocaleDateString()}
                  <span className={`activity-status ${activity.status}`}>
                    {activity.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
