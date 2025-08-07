import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const StyledSectionEvents = styled.div`
  margin: 0 auto;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h2`
  color: #000063;
  font-size: 2.5rem;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const BackgroundCard = styled.div`
  width: 100%;
  padding: 24px;
  background: #d9d9d9;
  border-radius: 24px;
  box-sizing: border-box;
`;

const Card = styled.div`
  font-size: 1.25rem;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: black;
  margin-bottom: 24px;
`;

const RegisterButton = styled.button`
  background: #000063;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #001199;
  }
`;

const MoreEventsButton = styled.button`
  background: #000063;
  color: #ffd712;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 32px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const NotificationDot = styled.div`
  width: 12px;
  height: 12px;
  background: #e50e32;
  border-radius: 50%;

`;


const EventsSection: React.FC = () => {
    const navigate = useNavigate();
  return (
    <StyledSectionEvents>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Heading>UPCOMING EVENTS</Heading>
        <NotificationDot />
      </div>

      

      <BackgroundCard>
        <Card>This is a sample event card or content block.</Card>
        <RegisterButton>REGISTER</RegisterButton>
      </BackgroundCard>

      <MoreEventsButton onClick={() => navigate("/event")}>MORE EVENTS</MoreEventsButton>
    </StyledSectionEvents>
  );
};

export default EventsSection;
