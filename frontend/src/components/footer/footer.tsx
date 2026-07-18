import React from "react";
import "./footer.css";
import Logo from "../../assets/hiskule_small.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { PRIMARY_NAVIGATION, ROUTES } from "../../shared/config/routes";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo-row" onClick={() => navigate(ROUTES.home)}>
            <img className="footer-logo-img" src={Logo} alt="Hi-Skule™ Logo" />
            <span className="footer-logo-text">Hi-Skule™</span>
          </div>
          <p className="footer-brand-desc">
            Engineering Outreach at the University of Toronto. Bridging academia and aspiration.
          </p>
          <div className="footer-social-row">
            <a
              className="footer-social-link"
              href="https://www.instagram.com/hiskule/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={32} />
            </a>
            <a
              className="footer-social-link"
              href="https://discord.gg/YsKmdBKRwD"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord size={32} />
            </a>
            <a
              className="footer-social-link"
              href="https://linktr.ee/Hi_SKULE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linktree"
            >
              <SiLinktree size={28} />
            </a>
            <a
              className="footer-social-link"
              href="mailto:hiskule@skule.ca"
              aria-label="Email"
            >
              <FaEnvelope size={32} />
            </a>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="footer-column">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-nav-list">
            <li
              className={`footer-nav-item ${currentPath === ROUTES.home ? "active" : ""}`}
              onClick={() => navigate(ROUTES.home)}
            >
              Home
            </li>
            {PRIMARY_NAVIGATION.map((item) => (
              <li
                key={item.path}
                className={`footer-nav-item ${currentPath === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-column">
          <h4 className="footer-col-title">Contact & Inquiries</h4>
          <p className="footer-contact-text">
            For general questions, workshop inquiries, or mentorship info, reach out at:
          </p>
          <p className="footer-contact-text">
            <a className="footer-mail-link" href="mailto:webmaster@hiskule.skule.ca">
              webmaster@hiskule.skule.ca
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Hi-Skule™ Engineering Outreach - University of Toronto. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

