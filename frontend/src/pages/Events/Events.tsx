import React from 'react';
import './Events.css';
import EventsSection from '../../components/event_section/event_section';
import { eventsData } from '../../data/events';
import MiniEventCard from '../../components/mini_event_card/MiniEventCard';

const Event: React.FC = () => {
  return (
    <div className="events-page-wrapper">
      {/* Page Hero - Navy */}
      <section className="events-hero-wrapper bg-navy">
        <div className="container-kinetic">
          <div className="events-hero">
            <div>
              <h1 className="events-hero-title">Engineering Your <span style={{ color: "var(--color-electric-gold)" }}>Future</span></h1>
              <p className="events-hero-desc">
                Explore upcoming workshops, campus tours, and outreach events hosted by the University of Toronto. Join our community of curious minds.
              </p>
            </div>
            <div className="events-year-badge">
              <span>Academic Year 2026-2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Next Event - Navy */}
      <section className="events-upcoming-wrapper bg-navy">
        <div className="container-kinetic">
          <div className="events-featured-next">
            <h2 className="events-section-title">UPCOMING EVENT</h2>
            <MiniEventCard 
              event={eventsData[0]} 
              buttonText="Register Now" 
              onButtonClick={() => {
                if (eventsData[0].link) window.open(eventsData[0].link, "_blank");
              }}
            />
          </div>
        </div>
      </section>

      {/* Events Grid - White */}
      <section className="events-all-wrapper bg-white">
        <div className="container-kinetic">
          <div style={{ textAlign: 'center', width: '100%', marginBottom: '32px' }}>
            <h2 className="events-section-title">
              SEE ALL EVENTS
            </h2>
          </div>
          <div className="events-grid">
            {eventsData.map((event, index) => (
              <EventsSection key={index} {...event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Event;

