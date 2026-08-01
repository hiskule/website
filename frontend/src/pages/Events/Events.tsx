import React, { useState } from 'react';
import './Events.css';
import EventsSection from './components/event_section';
import { eventsData, type EventData } from '../../data/events';
import MiniEventCard from '../../components/mini_event_card/MiniEventCard';
import EventPopupModal from '../../components/event_popup/EventPopupModal';

const Event: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

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
          </div>
        </div>
      </section>

      {/* Featured Next Event - Navy */}
      <section className="events-upcoming-wrapper bg-navy">
        <div className="container-kinetic">
          <div className="events-featured-next">
            <h2 className="events-section-title">UPCOMING EVENT</h2>
            <MiniEventCard
              event={eventsData.find(e => e.isUpcoming) || eventsData[0]}
              onLearnMore={() => {
                const upcoming = eventsData.find(e => e.isUpcoming) || eventsData[0];
                setSelectedEvent(upcoming);
              }}
              onButtonClick={() => {
                const upcoming = eventsData.find(e => e.isUpcoming) || eventsData[0];
                if (upcoming.link) window.open(upcoming.link, "_blank");
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
              <EventsSection
                key={index}
                {...event}
                onLearnMore={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        </div>
      </section>

      <EventPopupModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
  );
};

export default Event;

