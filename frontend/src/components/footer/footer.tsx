import React from "react";
import "./footer.css";
import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

const Footer: React.FC = () => {

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Contact Column */}
        <div className="footer-column">
          <h4 className="footer-col-title">Contact & Inquiries</h4>
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
          <p className="footer-contact-text">
            Inquiries of the website can be sent to: <a className="footer-mail-link" href="mailto:webmaster@hiskule.skule.ca">webmaster@hiskule.skule.ca</a>
          </p>
        </div>


      </div>


    </footer>
  );
};

export default Footer;

