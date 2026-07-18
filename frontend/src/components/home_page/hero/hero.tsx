import React from "react";
import "./hero.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/config/routes";
import { eventsData } from "../../../data/events";
import MiniEventCard from "../../mini_event_card/MiniEventCard";
const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-inner">
        {/* Left Column: Text & CTAs */}
        <div className="hero-content">
          <div className="hero-badge">
            <span>UNIVERSITY OF TORONTO ENGINEERING OUTREACH & MENTORSHIP</span>
          </div>
          <h1 className="hero-title">
            Inspiring the Next Generation of{" "}
            <span className="hero-title-gold">Engineers</span> at U of T
          </h1>
          <p className="hero-desc">
            Inspiring the next generation of engineers through hands-on outreach and mentorship. We bridge the gap between curiosity and creation.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary-gold"
              onClick={() => navigate(ROUTES.events)}
            >
              Join an Event (High School Students) →
            </button>
            <button
              className="btn-secondary-navy"
              onClick={() => navigate(ROUTES.mentor)}
            >
              Become a Mentor (U of T Students)
            </button>
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        <div className="hero-visual">
          <MiniEventCard 
            event={eventsData[0]} 
            className="hero-animated-card"
            onButtonClick={() => navigate(ROUTES.events)}
            buttonText="Learn More →"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;


