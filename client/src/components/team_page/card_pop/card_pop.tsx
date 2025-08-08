import React from "react";
import styled from "styled-components";

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Container = styled.div`
  width: 70%;
  height: 500px;
  background: linear-gradient(198deg, #000063 0%, white 70%);
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const ContentCard = styled.div`
  width: 90%;
  max-width: 600px;
  border-radius: 1.5rem;
  padding: 1rem;
  text-align: left;
  gap: 20px;
  display: flex;
  flex-direction: column;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
`;

const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: black;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
`;

const Position = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin: 0;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  margin-top: 2rem;
`;

interface PopupProps {
  data: { name: string; role: string; bio?: string };
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({ data, onClose }) => {
  if (!data) return null;


  return (

    <PopupOverlay onClick={onClose}>
        <Container>
            <Logo src="https://placehold.co/10x10" alt="Logo" />
        
        <ContentCard>
            
            <Name>{data.name}</Name>
            <Position>{data.role}</Position>
            <Description>
            {data.bio || 'No bio available.'}</Description>
            
        </ContentCard>
        </Container>
    </PopupOverlay>
  );

};

export default PopUp
