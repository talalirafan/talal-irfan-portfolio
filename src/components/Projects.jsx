import React, { useState, useEffect } from 'react';
import { SITE_TITLE_CORE } from '../brand.js';
import './Projects.css';

const projects = [
  {
    title: 'Maintenance Services Platform',
    description:
      'A professional full-stack web platform for scheduling, tracking, and managing facilities and property maintenance services. Features interactive booking forms, real-time tracking, and role-based access control.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'CSS3', 'REST APIs'],
    category: 'React Apps',
    liveUrl: 'http://54.144.78.175',
    details: {
      overview: 'Maintenance Services Platform is designed to bridge the gap between clients needing repairs and dispatchers/technicians handling maintenance operations. It provides a clean scheduling system, job tracking metrics, and administrative panels.',
      features: [
        'Interactive booking form with calendar slot selection',
        'Real-time job progress tracking dashboard',
        'Role-based dashboard systems for clients, technicians, and administrators',
        'Secure APIs for service logging and technicians updates'
      ],
      qaReport: 'Conducted manual functional testing of client and admin login flows. Checked database schema validations for booking submissions. Verified correct styling transitions and page load performance.'
    }
  },
  {
    title: 'Scalable ATM Finder & Bank Locator Backend',
    description:
      'A high-performance backend scraping hub and REST API for finding bank ATMs and branches across Pakistan. Features automated web scrapers, secure JWT auth, and Cloudflare/ngrok tunnels.',
    technologies: ['Node.js', 'Express', 'TypeScript', 'MongoDB', 'Playwright', 'Scraping'],
    category: 'Backend',
    liveUrl: 'https://github.com/talalirafan/atm-finder-backend',
    details: {
      overview: 'ATM Finder Backend is a robust server-side application designed to scrape, aggregate, and serve geolocation data of various bank ATMs and branches in Pakistan. It automates data extraction from official bank sites and maps them to a unified database schema.',
      features: [
        'Automated Playwright scrapers for major Pakistani banks (HBL, MCB, Meezan, Allied, etc.)',
        'Secure REST API built with Express, TypeScript, and Mongoose/MongoDB',
        'Authentication and session management using JWT and bcryptjs',
        'Integrated tools for tunneling and local testing (Cloudflare Tunnels, LocalTunnel, ngrok)'
      ],
      qaReport: 'Successfully verified all API endpoints (Auth, ATM searches, seeders). Playwright scripts were stress-tested for DOM resilience during scraping runs. Rate limiting and CORS headers were tested and validated.'
    }
  },
  {
    title: 'Positivus — Digital Marketing Agency',
    description:
      'A full marketing agency landing page with hero section, services grid, case studies, team profiles, testimonials, and contact form. Built to practice responsive layout and modern UI patterns.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    category: 'Landing Pages',
    liveUrl: 'https://ass-lac.vercel.app/',
    details: {
      overview: 'A premium landing page for a digital marketing agency, implementing responsive CSS grids, CSS variables, and modern hover interactions.',
      features: [
        'Responsive grids and cards structure for all devices',
        'Sleek details and clean layouts',
        'Accessible forms, buttons, and call-to-actions'
      ],
      qaReport: 'Cross-browser tested on Chrome, Firefox, and Safari. Validated HTML5 semantic layout for SEO and screen-reader accessibility.'
    }
  },
  {
    title: 'DOWN — Dating App Landing Page',
    description:
      'A hackathon-style product landing page for a dating app brand. Includes feature highlights, user stats, testimonials, press section, and app store CTAs with a clean mobile-first design.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
    category: 'Landing Pages',
    liveUrl: 'https://hackathon-sepia-eight.vercel.app/',
    details: {
      overview: 'A product landing page built during a hackathon to demonstrate modern UI styling, layouts, and CTA conversion optimizations.',
      features: [
        'Glassmorphic hero container and modern gradients',
        'Mobile-first layout system with clean breakpoints',
        'Highly visible action items and app store integration'
      ],
      qaReport: 'Tested responsive breakpoints from 320px to 2560px width. Checked image loading speeds and optimized performance assets.'
    }
  },
  {
    title: 'Balochi Simple Music Player',
    description:
      'A Spotify-inspired music player focused on Balochi music. Includes sidebar navigation, playback controls, and a library-style layout for learning component structure and styling.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    category: 'React Apps',
    liveUrl: 'https://music-player-pi-one.vercel.app/',
    details: {
      overview: 'A React application inspired by Spotify layout, loaded with Balochi songs. Uses React component state to manage audio playback, sidebar navigations, and volume controls.',
      features: [
        'Custom audio player interface with progression track',
        'Dynamic playlist rendering and track switching',
        'Stateful sidebar routing design'
      ],
      qaReport: 'Tested React component state lifecycle, audio play/pause edge cases (e.g. tracks changing dynamically), and browser media event bindings.'
    }
  },
  {
    title: 'Login & Signup Page',
    description:
      'Authentication UI with signup and login forms, Google sign-in option, and session-style layout. Built to practice form design, validation basics, and user flow between login states.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Forms'],
    category: 'Utilities',
    liveUrl: 'https://login-ivory-one.vercel.app/',
    details: {
      overview: 'A modular authentication form interface with custom inputs validation, password toggle, and modern OAuth brand button alignments.',
      features: [
        'Custom validation feedback alerts for inputs',
        'Password hide/reveal visibility toggle',
        'Google Sign-in brand layouts and responsiveness'
      ],
      qaReport: 'Tested form input edge cases (empty strings, incorrect formats) and verified UX state flows between registration and login forms.'
    }
  },
  {
    title: 'Digital Clock',
    description:
      'A real-time digital clock that shows hours, minutes, and seconds with AM/PM format. A focused assignment project to practice JavaScript timers, DOM updates, and clean minimal UI.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Utilities',
    liveUrl: 'https://clock-assigment.vercel.app/',
    details: {
      overview: 'A real-time clock application updating hourly/minute/second counters via JavaScript interval events.',
      features: [
        'Real-time standard DOM rendering',
        'Custom AM/PM format support',
        'Glassmorphism dark theme card wrapper'
      ],
      qaReport: 'Verified JavaScript timer accuracy (setInterval memory leaks prevention on component unmount).'
    }
  },
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);

  const categories = ['All', 'React Apps', 'Backend', 'Landing Pages', 'Utilities'];

  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | Projects`;
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <div className="section-header">
          <h2 className="section-title">Projects</h2>
          <div className="section-divider" />
        </div>

        {/* Category Tabs */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.liveUrl}
              className="project-card"
              onClick={() => setActiveProject(project)}
            >
              <div className="project-content">
                <span className="project-card-badge">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="tech-tag">+{project.technologies.length - 4} more</span>
                  )}
                </div>
              </div>
              <div className="project-actions">
                <button
                  type="button"
                  className="btn project-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                >
                  View Details & QA Report
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Detailed Modal */}
      {activeProject && (
        <div className="project-modal-overlay" onClick={() => setActiveProject(null)}>
          <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveProject(null)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="modal-header">
              <span className="modal-badge">{activeProject.category}</span>
              <h3 className="modal-title">{activeProject.title}</h3>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <h4>Overview</h4>
                <p>{activeProject.details.overview}</p>
              </div>
              <div className="modal-section">
                <h4>Key Features</h4>
                <ul>
                  {activeProject.details.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-section qa-section">
                <h4>🔍 QA & Quality Verification Report</h4>
                <p>{activeProject.details.qaReport}</p>
              </div>
              <div className="modal-tech-list">
                {activeProject.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary modal-btn"
              >
                {activeProject.liveUrl.includes('github.com') ? 'View Source Code' : 'Launch Live App'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
