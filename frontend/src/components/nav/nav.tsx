import React, { useState } from "react";
import "./nav.css";
import Logo from "../../assets/hiskule_small.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { PRIMARY_NAVIGATION, ROUTES } from "../../shared/config/routes";
import { useAuth } from "../../context/AuthContext";
import NavLoginDropdown from "./components/NavLoginDropdown";

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { role, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Logo Group */}
        <div className="nav-logo-group" onClick={() => handleNavClick(ROUTES.home)}>
          <img className="nav-logo-img" src={Logo} alt="Hi-Skule™ Logo" />
          <span className="nav-logo-text">Hi-Skule™</span>
        </div>

        {/* Desktop Links */}
        <nav className="nav-links-desktop">
          <span
            className={`nav-link ${currentPath === ROUTES.home ? "active" : ""}`}
            onClick={() => handleNavClick(ROUTES.home)}
          >
            HOME
          </span>
          {PRIMARY_NAVIGATION.map((item) => {
            // Hide the ADMIN tab if not an admin
            if (item.path === ROUTES.adminDashboard && role !== 'admin') return null;
            // Hide the EVENTS tab if not logged in or admin
            if (item.path === ROUTES.portal && role !== 'judge' && role !== 'team') return null;

            return (
              <span
                key={item.path}
                className={`nav-link ${currentPath === item.path ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
                style={item.path === ROUTES.adminDashboard || item.path === ROUTES.portal ? { color: 'var(--color-electric-gold, #F6CC13)' } : {}}
              >
                {item.label}
              </span>
            );
          })}
        </nav>

        {/* Right Side Actions (Login Dropdown / Logout / Hamburger) */}
        <div className="nav-actions-right">
          {!role ? (
            <div className="nav-login-wrapper">
              <button 
                className="nav-login-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                LOGIN
              </button>
              {showDropdown && <NavLoginDropdown onClose={() => setShowDropdown(false)} />}
            </div>
          ) : (
            <button 
              className="nav-logout-btn"
              onClick={() => {
                logout();
                handleNavClick(ROUTES.home);
              }}
            >
              LOGOUT
            </button>
          )}

          {/* Hamburger Button for Mobile */}
          <button
            className="nav-hamburger"
            aria-label="Open navigation"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Overlay */}
      {isOpen && (
        <div className="nav-drawer-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div className={`nav-mobile-drawer ${isOpen ? "open" : ""}`}>
        <span
          className={`nav-mobile-link ${currentPath === ROUTES.home ? "active" : ""}`}
          onClick={() => handleNavClick(ROUTES.home)}
        >
          HOME
        </span>
        {PRIMARY_NAVIGATION.map((item) => {
          if (item.path === ROUTES.adminDashboard && role !== 'admin') return null;
          if (item.path === ROUTES.portal && role !== 'judge' && role !== 'team') return null;

          return (
            <span
              key={item.path}
              className={`nav-mobile-link ${currentPath === item.path ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              style={item.path === ROUTES.adminDashboard || item.path === ROUTES.portal ? { color: 'var(--color-electric-gold, #F6CC13)' } : {}}
            >
              {item.label}
            </span>
          );
        })}

        {/* Mobile Login / Logout */}
        {!role ? (
          <button 
            className="nav-mobile-login-btn"
            onClick={() => {
              setIsOpen(false);
              setShowDropdown(true);
            }}
          >
            LOGIN
          </button>
        ) : (
          <button 
            className="nav-mobile-logout-btn"
            onClick={() => {
              logout();
              setIsOpen(false);
              handleNavClick(ROUTES.home);
            }}
          >
            LOGOUT
          </button>
        )}
      </div>
    </header>
  );
};

export default Nav;
