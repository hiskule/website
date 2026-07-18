import React from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

interface CardProps {
  data: {
    name: string;
    role: string;
    emaillink: string;
    link: string;
    img: string;
  };
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ data, onClick }) => {
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      className="team-card"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onClick) {
          onClick();
        }
      }}
    >
      <img className="team-card-img" src={data.img} alt={data.name} />

      <div className="team-card-text-container">
        <span className="team-card-role">{data.role}</span>
        <h3 className="team-card-name" style={{ marginTop: "8px" }}>
          {data.name}
        </h3>
      </div>

      <div className="team-card-links">
        <a
          href={data.emaillink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleIconClick}
          className="team-card-icon"
          aria-label={`Email ${data.name}`}
        >
          <FaEnvelope size={24} />
        </a>

        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleIconClick}
          className="team-card-icon"
          aria-label={`LinkedIn ${data.name}`}
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </article>
  );
};

export default Card;

