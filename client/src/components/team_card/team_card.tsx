import React from "react";
import styled from "styled-components";
import Logo from '../../assets/hiskule_full.png'

const OurMissionContainer = styled.div`
  background: white;
  border-radius: 2rem;
  margin: 0 auto;
  width: 70%;
  margin-top: 40px ;

`;

const Section = styled.div`
  padding: 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 100%;
`;

const TeamCard: React.FC = () => {
  return (
    <OurMissionContainer>
      <Section>
        <img src={Logo} style={{border: '1px solid red'}}/>
        <Title>OUR MISSION</Title>
        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          accumsan magna et auctor tristique. Nunc eleifend arcu sed nulla
          cursus efficitur. Ut porttitor non mauris nec fermentum. Nulla
          condimentum neque vitae sollicitudin pretium. Nulla auctor quam quis
          ipsum blandit eleifend. Quisque purus quam, blandit eget faucibus ac,
          dignissim vel massa. Aliquam erat volutpat. Aenean quam purus,
          molestie ut magna et, placerat volutpat tortor. Suspendisse elementum
          convallis lobortis.
        </Description>
      </Section>
    </OurMissionContainer>
  );
};

export default TeamCard
