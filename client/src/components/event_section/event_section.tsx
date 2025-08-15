import React from "react";
import Carousel from "../carousel";
import { Container,LeftContainer,  Title, Time, Description, RegisterButton } from "./event_section.style";

interface Props {
  title: string;
  time: string;
  description: string;
  images: string[]; 
  showRegister: boolean;
}



const EventsSection: React.FC<Props> = ({ title, time, description, images, showRegister }) => {

  return (
    <Container>
      <LeftContainer>
        <Title>{title}</Title>
        <Time>{time}</Time>
        <Description>{description}</Description>

        <RegisterButton  disabled={!showRegister} $showRegister={showRegister}>
          {showRegister ? 'REGISTER' : 'COMING UP'}
        </RegisterButton>

      </LeftContainer>

      {images && images.length > 0 && (
        <Carousel images={images}/>
      )}
    </Container>
  );
};

export default EventsSection
