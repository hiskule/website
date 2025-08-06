import React from "react";
import styled from "styled-components";
import Carousel from "../carousel";

interface Props {
  title: string;
  time: string;
  description: string;
  images: string[]; 
  showRegister: boolean;
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 40px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: black;
  text-align: center;
  margin: 0px;
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

const RegisterButton = styled.button<{ $showRegister: boolean }>`
  background: #000063;
  color: ${({ $showRegister }) => ($showRegister ? '#FFD712' : 'white')};
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
    background: ${({ $showRegister }) => ($showRegister ? '#000045' : '#000063')};
  }
`;


const EventsSection: React.FC<Props> = ({ title, time, description, images, showRegister }) => {

  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '50%' }}>
        <Title>{title}</Title>
        <Time>{time}</Time>
        <Description>{description}</Description>

        <div style={{ alignSelf: 'center' }}>
            <RegisterButton  disabled={!showRegister} $showRegister={showRegister}>{showRegister ? 'REGISTER' : 'COMING UP'}</RegisterButton>
        </div>

      </div>


      {images && images.length > 0 && (
        <Carousel images={images}/>
      )}
    </Container>
  );
};

export default EventsSection
