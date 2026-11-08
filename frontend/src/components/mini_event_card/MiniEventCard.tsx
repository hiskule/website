import React from "react";
import "./MiniEventCard.css";
import { STUDENT_PARENT_MAILING_LIST_URL } from "../../data/events";

interface EventData {
  title: string;
  time: string;
  description: string;
  images: string[];
  link?: string;
  isUpcoming?: boolean;
}

interface MiniEventCardProps {
  event: EventData;
  onButtonClick?: () => void;
  onLearnMore?: () => void;
  className?: string;
}

const MiniEventCard: React.FC<MiniEventCardProps> = ({ 
  event, 
  onButtonClick,
  onLearnMore,
  className = "" 
}) => {
  const handlePrimaryClick = () => {
    if (event.link) {
      if (onButtonClick) {
        onButtonClick();
      } else {
        window.open(event.link, "_blank");
      }
    } else {
      window.open(STUDENT_PARENT_MAILING_LIST_URL, "_blank");
    }
  };

  return (
    <div className={`mini-event-card ${className}`}>
      <div className="mini-event-image-wrapper">
        <img
          className="mini-event-img"
          src={event.images[0]}
          alt={event.title}
        />
      </div>
      <div className="mini-event-content">
        <div className="mini-event-time">📅 {event.time}</div>
        <h3 className="mini-event-title">
          <span>{event.title}</span>
          {event.isUpcoming && (
            <span className="mini-event-title-badge">
              {event.link ? "NEXT EVENT" : "COMING SOON"}
            </span>
          )}
        </h3>
        <p 
          className="mini-event-desc" 
          dangerouslySetInnerHTML={{ __html: event.description }} 
        />
        {event.isUpcoming && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {onLearnMore && (
              <button 
                className="btn-secondary-outline mini-event-btn"
                onClick={onLearnMore}
              >
                Learn More
              </button>
            )}
            <button 
              className="btn-primary-gold mini-event-btn"
              onClick={handlePrimaryClick}
            >
              {event.link ? "Register Now" : "Stay Updated →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniEventCard;
