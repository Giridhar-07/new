import React, { useState, useRef, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');
  const formRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitStatus('sending');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      content: '+1 234 567 8900',
      delay: 0
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'info@luxurystay.com',
      delay: 100
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      content: '123 Luxury Avenue, Suite 100, Beverly Hills, CA 90210',
      delay: 200
    }
  ];

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header animate-on-scroll">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Please fill out the form below or reach out using our contact information.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-container animate-on-scroll">
            <form ref={formRef} onSubmit={handleSubmit} className={`contact-form ${submitStatus}`}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
                <div className="form-highlight"></div>
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows="5"
                ></textarea>
                <div className="form-highlight"></div>
              </div>

              <button 
                type="submit" 
                className={`submit-button ${submitStatus}`}
                disabled={submitStatus === 'sending'}
              >
                <span className="button-text">
                  {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </span>
                <FaPaperPlane className="button-icon" />
              </button>
            </form>

            {submitStatus === 'success' && (
              <div className="success-message">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="error-message">
                Oops! Something went wrong. Please try again.
              </div>
            )}
          </div>

          <div className="contact-info">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="info-card animate-on-scroll"
                style={{ animationDelay: `${info.delay}ms` }}
              >
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h3>{info.title}</h3>
                  <p>{info.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
