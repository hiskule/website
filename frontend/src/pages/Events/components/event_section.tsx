import React from "react";
import Carousel from "../../../components/carousel/carousel";

import { STUDENT_PARENT_MAILING_LIST_URL } from "../../../data/events";

interface Props {
  title: string;
  time: string;
  description: string;
  images: string[];
  link?: string;
  isUpcoming?: boolean;
  onLearnMore?: () => void;
}

const EventsSection: React.FC<Props> = ({ title, time, description, images, link, isUpcoming, onLearnMore }) => {
  return (
    <article className="event-card">
      <div className="event-info-col">
        <div className="event-time-badge">
          <span>📅 {time}</span>
        </div>
        <h3 className="event-title">
          <span>{title}</span>
          {isUpcoming && (
            <span className="mini-event-title-badge">
              {link ? "NEXT EVENT" : "COMING SOON"}
            </span>
          )}
        </h3>
        <div className="event-desc" dangerouslySetInnerHTML={{ __html: description }} />

        {isUpcoming && (
          <div style={{ marginTop: "16px", display: 'flex', gap: '12px' }}>
            {onLearnMore && (
              <button
                className="btn-secondary-outline"
                onClick={onLearnMore}
              >
                Learn More
              </button>
            )}
            {link ? (
              <button
                className="btn-primary-gold"
                onClick={() => window.open(link, "_blank")}
              >
                REGISTER NOW →
              </button>
            ) : (
              <button
                className="btn-primary-gold"
                onClick={() => window.open(STUDENT_PARENT_MAILING_LIST_URL, "_blank")}
              >
                STAY UPDATED →
              </button>
            )}
          </div>
        )}
      </div>

      {images && images.length > 0 && (
        <div className="event-carousel-col">
          <Carousel images={images} />
        </div>
      )}
    </article>
  );
};

export default EventsSection;

