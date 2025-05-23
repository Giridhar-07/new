import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Customers.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/api/customers/?page=${currentPage}&search=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCustomers(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddCustomer = () => {
    // Implement add customer functionality
    console.log('Add new customer');
  };

  const handleEditCustomer = (customerId) => {
    // Implement edit functionality
    console.log('Edit customer:', customerId);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://127.0.0.1:8000/api/customers/${customerId}/`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          setCustomers(customers.filter(customer => customer.id !== customerId));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div className="customers-container">
      <div className="customers-content">
        <div className="customers-header">
          <h1 className="customers-title">Customer Management</h1>
          <p className="customers-subtitle">
            Manage your hotel customers and their information
          </p>
        </div>

        <div className="customers-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <button className="add-customer-button" onClick={handleAddCustomer}>
            <FaUserPlus />
            <span>Add Customer</span>
          </button>
        </div>

        <table className="customers-table">
          <thead className="table-header">
            <tr>
              <th>Customer Info</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="table-row">
                <td>
                  <div className="customer-info">
                    <img
                      src={customer.avatar || `https://ui-avatars.com/api/?name=${customer.first_name}+${customer.last_name}`}
                      alt={`${customer.first_name} ${customer.last_name}`}
                      className="customer-avatar"
                    />
                    <div className="customer-details">
                      <span className="customer-name">
                        {customer.first_name} {customer.last_name}
                      </span>
                      <span className="customer-email">{customer.email}</span>
                    </div>
                  </div>
                </td>
                <td>{customer.phone}</td>
                <td>
                  <span className={`status-badge ${customer.is_active ? 'status-active' : 'status-inactive'}`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(customer.last_visit).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditCustomer(customer.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customers;
