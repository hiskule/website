import React from "react";
import { useNavigate } from "react-router-dom";
import {StyledSectionEvents, HeadingWrapper, Heading, NotificationDot, BackgroundCard, Card, RegisterButton, MoreEventsButton} from "./eventCard.style";
import Carousel from "../../carousel/carousel";
import {eventPromo} from "../../../data/home"

const EventsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledSectionEvents>
      <HeadingWrapper>
        <Heading>UPCOMING EVENTS</Heading>
        <NotificationDot />
      </HeadingWrapper>

      <BackgroundCard>
        <Card>
         <Carousel images={eventPromo.images}/>
        
        </Card>
       
        <RegisterButton onClick={() => { if (eventPromo.link) window.open(eventPromo.link, "_blank")}}>REGISTER</RegisterButton>
      </BackgroundCard>

      <MoreEventsButton onClick={() => navigate("/event")}>
        MORE EVENTS
      </MoreEventsButton>
    </StyledSectionEvents>
  );
};

export default EventsSection;

