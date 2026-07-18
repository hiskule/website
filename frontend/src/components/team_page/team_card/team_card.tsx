import React from "react";

interface TeamCardProps {
  imageSrc: string;
  description: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ imageSrc, description }) => {
  return (
    <section className="team-mission-box">
      <div>
        <img className="team-mission-img" src={imageSrc} alt="Team Logo" />
      </div>
      <div>
        <h2 className="team-mission-title">OUR MISSION</h2>
        <div
          className="team-mission-text"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </section>
  );
};

export default TeamCard;

