import React from "react";
import Carousel from "../../../components/carousel/carousel";

interface Props {
  title: string;
  time: string;
  description: string;
  images: string[];
  link?: string;
}

const EventsSection: React.FC<Props> = ({ title, time, description, images, link }) => {
  return (
    <article className="event-card">
      <div className="event-info-col">
        <div className="event-time-badge">
          <span>📅 {time}</span>
        </div>
        <h3 className="event-title">{title}</h3>
        <div className="event-desc" dangerouslySetInnerHTML={{ __html: description }} />

        {link && (
          <div style={{ marginTop: "16px" }}>
            <button
              className="btn-primary-gold"
              onClick={() => window.open(link, "_blank")}
            >
              REGISTER NOW →
            </button>
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

