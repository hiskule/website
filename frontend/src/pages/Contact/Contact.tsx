import React from "react";
import "./Contact.css";
import FloatingImages from "../../components/contact_page/floating_image/floating_image";
import SocialBubbles from "../../components/contact_page/socialbubble/socialbubble";

const Contact: React.FC = () => {
  return (
    <div className="contact-page-container">
      {/* Background floating images */}
      <div className="contact-floating-wrap">
        <FloatingImages />
      </div>

      {/* Foreground content card */}
      <div className="contact-content-card">
        <h1 className="contact-title">Get In Touch!</h1>
        <p className="contact-desc">
          Have questions about our high school workshops, engineering outreach, or volunteer mentorship? Reach out or connect with our community across platforms.
        </p>
        <SocialBubbles />
      </div>
    </div>
  );
};

export default Contact;

