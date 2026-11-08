import React, { useState } from 'react';
import './Events.css';
import EventsSection from './components/event_section';
import { eventsData, STUDENT_PARENT_MAILING_LIST_URL, type EventData } from '../../data/events';
import { uthsdcImages } from '../../assets/UTHSDC';
import MiniEventCard from '../../components/mini_event_card/MiniEventCard';
import EventPopupModal from '../../components/event_popup/EventPopupModal';

const Event: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const upcomingEvent = eventsData.find(e => e.isUpcoming);

  return (
    <div className="events-page-wrapper">
      {/* Page Hero - Navy */}
      <section className={`events-hero-wrapper bg-navy ${!upcomingEvent ? 'no-upcoming' : ''}`}>
        <div className="container-kinetic">
          <div className={`events-hero ${!upcomingEvent ? 'no-upcoming' : ''}`}>
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
      {upcomingEvent && (
        <section className="events-upcoming-wrapper bg-navy">
          <div className="container-kinetic">
            <div className="events-featured-next">
              <h2 className="events-section-title">UPCOMING EVENT</h2>
              <MiniEventCard
                event={upcomingEvent}
                onLearnMore={() => setSelectedEvent(upcomingEvent)}
                onButtonClick={() => {
                  if (upcomingEvent.link) {
                    window.open(upcomingEvent.link, "_blank");
                  } else {
                    window.open(STUDENT_PARENT_MAILING_LIST_URL, "_blank");
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Events Grid - White */}
      <section className="events-all-wrapper bg-white">
        <div className="container-kinetic">
          {/* Permanent Student & Parent Mailing List Section */}
          <div className="events-mailing-card">
            <div className="events-mailing-content">
              <h3 className="events-mailing-title">Stay In The Loop for Future Events</h3>
              <p className="events-mailing-desc">
                Want to be the first to know when registrations open for our engineering design competitions, hands-on workshops, and Skule tours? Join our student and parent mailing list to receive event announcements and ticket drops right in your inbox!
              </p>
              <div>
                <a
                  href={STUDENT_PARENT_MAILING_LIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-gold events-mailing-btn"
                >
                  JOIN THE MAILING LIST →
                </a>
              </div>
            </div>
            <div className="events-mailing-img-col">
              <img
                src={uthsdcImages.groups[0]}
                alt="High school students and mentors at UTHSDC"
                className="events-mailing-img"
              />
            </div>
          </div>

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

