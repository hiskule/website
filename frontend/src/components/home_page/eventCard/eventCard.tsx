import React from "react";
import "./eventCard.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/config/routes";

const EventsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="events-cta-container">
      {/* Bottom CTA Section from ui_guideline */}
      <section className="home-bottom-cta">
        <div className="home-cta-badge-top" />
        <div className="home-cta-badge-bottom" />
        <h2 className="home-cta-title">Ready to engineer your future?</h2>
        <p className="home-cta-desc">
          Whether you are a high school student looking to learn or a U of T engineer looking to give back, there's a place for you in our community.
        </p>
        <div className="home-cta-buttons">
          <button
            className="btn-navy-solid"
            onClick={() => navigate(ROUTES.mentor)}
          >
            APPLY TO BE A MENTOR
          </button>
          <button
            className="btn-navy-outline"
            onClick={() => navigate(ROUTES.events)}
          >
            EXPLORE WORKSHOPS
          </button>
        </div>
      </section>
    </div>
  );
};

export default EventsSection;


