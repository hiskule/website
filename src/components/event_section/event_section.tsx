import React from "react";
import Carousel from "../carousel/carousel";
import { Container,LeftContainer,  Title, Time, Description, RegisterButton, RightContainer } from "./event_section.style";

interface Props {
  title: string;
  time: string;
  description: string;
  images: string[]; 
  link?: string; 
}



const EventsSection: React.FC<Props> = ({ title, time, description, images, link }) => {

  return (
    <Container>
      <LeftContainer>
        <Title>{title}</Title>
        <Time>{time}</Time>
        <Description dangerouslySetInnerHTML={{ __html: description }}/>

        <RegisterButton  $showRegister={!!link} onClick={() => { if (link) window.open(link, "_blank")}}>
          {!!link ? 'REGISTER' : 'COMING UP'}
        </RegisterButton>

      </LeftContainer>

      {images && images.length > 0 && (
        <RightContainer>
          <Carousel images={images}/>
        </RightContainer>
      )}

    </Container>
  );
};

export default EventsSection
