import React, { useState, useEffect } from 'react';
import { SITE_TITLE_CORE } from '../brand.js';
import './Contact.css';

const Contact = () => {
  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | Contact`;
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the form data
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="section-header">
          <h2 className="section-title">Contact Me</h2>
          <div className="section-divider"></div>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p>I'm always open to discussing new opportunities and interesting projects. Feel free to reach out!</p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">talalirfan987@gmail.com</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">03716222503</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">💻</div>
                <div>
                  <div className="contact-label">GitHub</div>
                  <div className="contact-value">
                    <a href="https://github.com/talalirafan" target="_blank" rel="noopener noreferrer">
                      github.com/talalirfan
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
