import React from "react";
import { useNavigate } from "react-router-dom";
import {StyledSectionEvents, HeadingWrapper, Heading, NotificationDot, BackgroundCard, Card, RegisterButton, MoreEventsButton} from "./eventCard.style";
import Carousel from "../../carousel/carousel";
import {eventData} from "../../../data/home"

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
         <Carousel images={eventData.images}/>
        
        </Card>
       
        <RegisterButton onClick={() => { if (eventData.link) window.open(eventData.link, "_blank")}}>REGISTER</RegisterButton>
      </BackgroundCard>

      <MoreEventsButton onClick={() => navigate("/event")}>
        MORE EVENTS
      </MoreEventsButton>
    </StyledSectionEvents>
  );
};

export default EventsSection;

