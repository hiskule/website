import React from 'react';
import './Events.css';
import EventsSection from '../../components/event_section/event_section';
import Carousel from '../../components/carousel/carousel';
import { eventsData } from '../../data/events';
import * as MentorPics from '../../assets/random_mentor_pic';
import MiniEventCard from '../../components/mini_event_card/MiniEventCard';

const Event: React.FC = () => {
  return (
    <div className="events-page-container">
      {/* Page Hero */}
      <div className="events-hero">
        <div>
          <h1 className="events-hero-title">Engineering Your Future</h1>
          <p className="events-hero-desc">
            Explore upcoming workshops, campus tours, and outreach events hosted by the University of Toronto. Join our community of curious minds.
          </p>
        </div>
        <div className="events-year-badge">
          <span>Academic Year 2026-2027</span>
        </div>
      </div>

      {/* Featured Next Event */}
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

      {/* Events Grid */}
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

      {/* Extra Highlights Section */}
      <section className="events-extra-section">
        <h2 className="events-extra-title">Stay Tuned For More Events</h2>
        <div className="events-extra-grid">
          <div className="event-carousel-col">
            <Carousel images={[MentorPics.fifth, MentorPics.third, MentorPics.seventh, MentorPics.ninth]} />
          </div>
          <div className="event-carousel-col">
            <Carousel images={[MentorPics.forth, MentorPics.second, MentorPics.sixth, MentorPics.first]} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Event;

