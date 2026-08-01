import React, { useEffect, useRef } from 'react';
import './EventPopupModal.css';
import type { EventData } from '../../data/events';

interface EventPopupModalProps {
  event: EventData | null;
  onClose: () => void;
  isOpen: boolean;
}

const EventPopupModal: React.FC<EventPopupModalProps> = ({ event, onClose, isOpen }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!isOpen || !event) return null;
  
  const { details } = event;

  // Insert a break after the first word for multi-line title effect, 
  // or use the string as is if only one word.
  const formatTitle = (title: string) => {
    const spaceIndex = title.indexOf(' ');
    if (spaceIndex === -1) return title;
    return `${title.substring(0, spaceIndex)} <br/> ${title.substring(spaceIndex + 1)}`;
  };

  return (
    <div className="event-popup-overlay">
      <div className="event-popup-container-new" ref={popupRef}>
        
        {/* Hero Section */}
        <div className="event-popup-hero-new">
          <button className="event-popup-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="event-popup-hero-content">
            <div className="event-popup-hero-left">
              <div className="event-popup-hero-label">
                <span className="event-popup-hero-line"></span>
                <span>Featured Event</span>
              </div>
              <h1 
                className="event-popup-hero-title-new" 
                dangerouslySetInnerHTML={{ __html: formatTitle(event.title) }} 
              />
              <p className="event-popup-hero-desc">{event.description}</p>
            </div>
            
            <div className="event-popup-hero-right">
              <div className="event-popup-hero-collage">
                {event.images.slice(0, 4).map((img, idx) => (
                  <img 
                    key={idx}
                    className="event-popup-hero-img-item" 
                    src={img} 
                    alt={`${event.title} image ${idx + 1}`} 
                  />
                ))}
              </div>
              <div className="event-popup-hero-gradient"></div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="event-popup-content-new">
          <div className="event-popup-grid-new">
            
            {/* Left Column: Core Details */}
            <div className="event-popup-details-col">
              <div className="event-popup-info-row-top">
                <section className="event-popup-info-section">
                  <h3 className="event-popup-section-header">
                    <span className="material-symbols-outlined text-icon">calendar_today</span> WHEN
                  </h3>
                  <p className="event-popup-text-main">{details?.date}</p>
                  <p className="event-popup-text-sub">{details?.timeframe}</p>
                </section>
                
                <section className="event-popup-info-section">
                  <h3 className="event-popup-section-header">
                    <span className="material-symbols-outlined text-icon">location_on</span> WHERE
                  </h3>
                  <p className="event-popup-text-main">{details?.location?.building}</p>
                  {details?.location?.mapUrl && (
                    <a className="event-popup-link" href={details.location.mapUrl} target="_blank" rel="noopener noreferrer">
                      {details.location.address} (Open in Google Maps)
                    </a>
                  )}
                </section>
              </div>
              
              <div className="event-popup-info-row-bottom">
                <section className="event-popup-info-section">
                  <h3 className="event-popup-section-header-solid">
                    <span className="material-symbols-outlined text-electric-gold text-icon">group</span> ELIGIBILITY
                  </h3>
                  <div className="eligibility-box">
                    {details?.requirements?.map((req, idx) => (
                      <p key={idx} className="eligibility-item" dangerouslySetInnerHTML={{ __html: req }} />
                    ))}
                  </div>
                </section>
                
                <section className="event-popup-info-section">
                  <h3 className="event-popup-section-header-solid">
                    <span className="material-symbols-outlined text-electric-gold text-icon">star</span> HIGHLIGHTS
                  </h3>
                  <ul className="event-popup-highlights-new">
                    {details?.highlights?.map((h, i) => (
                      <li key={i}>
                        <span className="material-symbols-outlined text-electric-gold highlight-check">check_circle</span> 
                        {h}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* Right Column: Integrated Schedule */}
            {details?.itinerary && details.itinerary.length > 0 && (
              <div className="event-popup-schedule-col">
                <div className="schedule-sticky">
                  <h2 className="schedule-header">
                    <span className="schedule-header-accent"></span> Schedule
                  </h2>
                  <div className="schedule-timeline-new">
                    {details.itinerary?.map((item, idx) => (
                      <div key={idx} className={`schedule-item-new ${idx === details.itinerary!.length - 1 ? 'last-item' : ''}`}>
                        <div className={`schedule-dot ${idx === 0 ? 'bg-electric-gold' : 'bg-deep-navy'}`}></div>
                        <span className="schedule-time-new">{item.time}</span>
                        <span className="schedule-activity-new">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transactional Footer */}
        {event.isUpcoming && (details?.registrationDeadline || event.link) && (
          <div className="event-popup-footer-new">
            <div className="footer-left">
              {details?.registrationDeadline && (
                <div className="deadline-container">
                  <span className="deadline-label">Registration Deadline</span>
                  <div className="deadline-badge-new">
                    <span className="material-symbols-outlined">alarm</span>
                    <span>{details.registrationDeadline}</span>
                  </div>
                </div>
              )}
            </div>
            {event.link && (
              <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-popup-signup-btn-new">
                Sign Up Now
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPopupModal;
