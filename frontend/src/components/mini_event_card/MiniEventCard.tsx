import React from "react";
import "./MiniEventCard.css";

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
  return (
    <div className={`mini-event-card ${className}`}>
      <div className="mini-event-image-wrapper">
        <img
          className="mini-event-img"
          src={event.images[0]}
          alt={event.title}
        />
        {event.isUpcoming && <div className="mini-event-badge">NEXT EVENT</div>}
      </div>
      <div className="mini-event-content">
        <div className="mini-event-time">📅 {event.time}</div>
        <h3 className="mini-event-title">{event.title}</h3>
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
            {onButtonClick && (
              <button 
                className="btn-primary-gold mini-event-btn"
                onClick={event.link ? onButtonClick : undefined}
                disabled={!event.link}
                style={!event.link ? { cursor: "not-allowed", opacity: 0.5, filter: "grayscale(100%)" } : {}}
              >
                {event.link ? "Register Now" : "Coming Soon"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniEventCard;
