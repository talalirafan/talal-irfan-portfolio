import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SITE_TITLE_CORE } from '../brand.js';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contact';
import Dashboard from './Dashboard';
import BugHunter from './BugHunter';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | Portfolio`;
  }, []);

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'home';
    const targetId = location.hash ? location.hash.slice(1) : path;
    const element = document.getElementById(targetId);

    if (element) {
      window.setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <section id="home" className="home">
        <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">
            Hi, I'm <span className="highlight">Talal Irfan</span>
          </h1>
          <h2 className="home-subtitle">
            Web Developer Intern at Arius Automation | Full Stack Developer
          </h2>
          <p className="home-description">
            I am a Web Developer Intern at Arius Automation and a Full Stack Developer. I design, build, and deploy end-to-end web applications using React, Express, NestJS, and SQL, focusing on high-quality code and robust software architectures.
          </p>
          <div className="home-buttons">
            <button className="btn primary" onClick={() => navigate('/projects')}>
              View My Work
            </button>
            <button className="btn secondary" onClick={() => navigate('/contact')}>
              Get In Touch
            </button>
          </div>
        </div>
        <div className="home-visual">
          <Dashboard />
        </div>
      </div>
    </section>

      <div className="reveal-on-scroll"><About /></div>
      <div className="reveal-on-scroll"><Skills /></div>
      <div className="reveal-on-scroll"><BugHunter /></div>
      <div className="reveal-on-scroll"><Projects /></div>
      <div className="reveal-on-scroll"><Contact /></div>
    </>
  );
};

export default Home;
