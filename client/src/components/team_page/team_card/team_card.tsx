import React from "react";
import { OurMissionContainer, Section, Title, Description } from "./team_card.style";

interface TeamCardProps {
  imageSrc: string;
  description: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ imageSrc, description }) => {
  return (
    <OurMissionContainer>
      <Section>
        <img src={imageSrc} alt="Team Logo" style={{ border: '1px solid red' }} />
        <Title>OUR MISSION</Title>
        <Description>{description}</Description>
      </Section>
    </OurMissionContainer>
  );
};

export default TeamCard;
