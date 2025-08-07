import React from "react";
import styled from "styled-components";

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
`;

const StyledCard = styled.div`
  background: white;
  border-radius: 2rem;
  width: 25%;
  min-width: 280px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RectangleTop = styled.div`
  background: #d9d9d9;
  height: 300px;
  border-radius: 1rem;
`;

const RectangleBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const SmallRect = styled.div`
  width: 60px;
  height: 60px;
  background: #d9d9d9;
  border-radius: 0.5rem;
`;

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const Position = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Card: React.FC = () => {
  return (
    <CardsContainer>
      
        <StyledCard>
          <RectangleTop />
          <Name>Your Name</Name>
          <Position>Position</Position>
          <RectangleBottom>
            <SmallRect />
            <SmallRect />
          </RectangleBottom>
        </StyledCard>
      
    </CardsContainer>
  );
};


export default Card
