import React, { useState } from "react";
import "./nav.css";
import Logo from "../../assets/hiskule_small.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { PRIMARY_NAVIGATION, ROUTES } from "../../shared/config/routes";

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);

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
          {PRIMARY_NAVIGATION.map((item) => (
            <span
              key={item.path}
              className={`nav-link ${currentPath === item.path ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* Hamburger Button for Mobile */}
        <button
          className="nav-hamburger"
          aria-label="Open navigation"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
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
        {PRIMARY_NAVIGATION.map((item) => (
          <span
            key={item.path}
            className={`nav-mobile-link ${currentPath === item.path ? "active" : ""}`}
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </span>
        ))}
      </div>
    </header>
  );
};

export default Nav;

