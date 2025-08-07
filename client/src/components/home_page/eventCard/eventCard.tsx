// EventsSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  StyledSectionEvents,
  HeadingWrapper,
  Heading,
  NotificationDot,
  BackgroundCard,
  Card,
  RegisterButton,
  MoreEventsButton,
} from "./eventCard.style";

const EventsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledSectionEvents>
      <HeadingWrapper>
        <Heading>UPCOMING EVENTS</Heading>
        <NotificationDot />
      </HeadingWrapper>

      <BackgroundCard>
        <Card>This is a sample event card or content block.</Card>
        <RegisterButton>REGISTER</RegisterButton>
      </BackgroundCard>

      <MoreEventsButton onClick={() => navigate("/event")}>
        MORE EVENTS
      </MoreEventsButton>
    </StyledSectionEvents>
  );
};

export default EventsSection;

