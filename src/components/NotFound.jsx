import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE_TITLE_CORE } from '../brand.js';
import './About.css';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | Page Not Found`;
  }, []);

  return (
    <section className="about notfound">
      <div className="about-container">
        <div className="section-header">
          <h2 className="section-title">Page Not Found</h2>
          <div className="section-divider"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>Sorry, the page you are looking for does not exist.</p>
            <p>Please use the navigation menu or return to the home page.</p>
            <button className="btn primary" onClick={() => navigate('/home')}>Go Home</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
