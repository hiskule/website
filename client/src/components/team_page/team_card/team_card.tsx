import React from "react";
import { OurMissionContainer, Section, Title, Description } from "./team_card.style";
import Logo from '../../../assets/hiskule_full.png'

const TeamCard: React.FC = () => {
  return (
    <OurMissionContainer>
      <Section>
        <img src={Logo} style={{border: '1px solid red'}}/>
        <Title>OUR MISSION</Title>
        <Description>
          The Hi-Skule™ directorship serves as the Engineering Society’s bridge between secondary and primary school students and the SKULE community. Our outreach efforts are designed to be engaging, enlightening, empowering, and invigorating for both students and executives alike.
        </Description>
      </Section>
    </OurMissionContainer>
  );
};

export default TeamCard
