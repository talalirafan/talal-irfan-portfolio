import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/useTheme.js';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink
          to="/home"
          className="nav-logo"
          onClick={closeMenu}
          aria-label="Home — طلال"
        >
          <span className="nav-logo-ur" lang="ur" dir="rtl">
            طلال
          </span>
        </NavLink>
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/skills" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Skills
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
            Contact
          </NavLink>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => {
              toggleTheme();
              closeMenu();
            }}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
          <span className={isOpen ? 'bar open' : 'bar'}></span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
