import React from "react";
import styled from "styled-components";
import Slider from "react-slick";

interface Props {
  title: string;
  time: string;
  description: string;
  images?: string[]; 
  showRegister?: boolean;
}


const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 40px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: black;
  text-align: center;
  margin: 5px;
  align-self: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Time = styled.p`
  font-size: 30px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: black;
  text-align: center;
  margin: 0px;
  align-self: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: black;
  text-align: center;
  max-width: 800px;
  margin-bottom: 40px;
  text-align: left;
  align-self: flex-start;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const RegisterButton = styled.button`
  background: #000063;
  color: #FFD712;
  font-size: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border: none;
  border-radius: 40px;
  padding: 16px 32px;
  cursor: pointer;
  transition: background 0.3s;
  width: fit-content;


  &:hover {
    background: #000045;
  }
`;

const CarouselWrapper = styled.div`
  flex: 1 1;
  max-width: 350px;
  margin: 10px;
  padding: 0px 10px;


  .slick-slide img {
    width: 100%;
    border-radius: 16px;
  }

  .slick-prev, .slick-next {
  z-index: 1;
}

`;


const EventsSection: React.FC<Props> = ({ title, time, description, images, showRegister = true }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,         
    autoplaySpeed: 3000,   //3 secons
    pauseOnHover: true,   
  };

  return (
    <Container>
      <div style={{display: 'flex', flexDirection: 'column', }}>
        <Title>{title}</Title>
        <Time>{time}</Time>
        <Description>{description}</Description>

        {showRegister && <RegisterButton>REGISTER</RegisterButton>}
      </div>
      {images && images.length > 0 && (
        <CarouselWrapper>
          <Slider {...sliderSettings}>
            {images.map((src, index) => (
              <div key={index}>
                <img src={src} alt={`Event image ${index + 1}`} />
              </div>
            ))}
          </Slider>
        </CarouselWrapper>
      )}
    </Container>
  );
};

export default EventsSection
