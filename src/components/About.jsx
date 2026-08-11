import React, { useEffect } from 'react';
import { SITE_TITLE_CORE } from '../brand.js';
import './About.css';

const About = () => {
  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | About`;
  }, []);

  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <div className="section-divider"></div>
        </div>
        <div className="about-content">
          <div className="about-text">
            <p>
              I am a passionate developer and Web Developer Intern at <strong>Arius Automation</strong>, where I focus on full stack development, software testing, and building robust web architectures. I have been building robust, end-to-end web applications and learning web technologies for <strong>2 years</strong>.
            </p>
            <p>
              My full-stack tech stack includes HTML/CSS, JavaScript, React for the frontend, and Node.js, Express, NestJS, and SQL for the backend. My internship has allowed me to strengthen my development skills and combine them with software testing methodologies to ensure high-quality, bug-free applications.
            </p>
            <p>
              My goal is to become a professional software engineer who can build and verify scalable, 
              efficient, and beautiful web applications. I'm always eager to learn new technologies and take on challenging projects.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Years Learning</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Live Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Technologies Learned</div>
            </div>
          </div>
        </div>

        <div className="about-timeline-section">
          <h3 className="timeline-title">My Career Journey</h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2026 - Present</div>
              <div className="timeline-content">
                <h4>Web Developer Intern</h4>
                <h5>Arius Automation</h5>
                <p>Focused on full stack development, frontend interfaces, backend APIs, database integrations, and participating in the software lifecycle to deliver seamless web products.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2024 - Present</div>
              <div className="timeline-content">
                <h4>Web Developer Student</h4>
                <h5>Self-Learning & Projects</h5>
                <p>Learning modern frontend technologies (HTML5, CSS3, ES6 JavaScript, React) and building, testing, and deploying live production-ready web applications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

