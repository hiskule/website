import React from "react";
import styled from "styled-components";

interface CardProps {
  data: {
    name: string;
    role: string;
  };
  onClick?: () => void;
}

const StyledCard = styled.div`
  background: white;
  border-radius: 2rem;
  width: 25%;
  min-width: 280px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.005);
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const RectangleTop = styled.div`
  background: #d9d9d9;
  height: 300px;
  border-radius: 1rem;
`;

const LinkSection = styled.div`
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

const Card: React.FC<CardProps> = ({ data, onClick }) => {
  return (
    <StyledCard onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <RectangleTop />

      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Name>{data.name}</Name>
        <Position>{data.role}</Position>
      </div>

      <LinkSection>
        <SmallRect />
        <SmallRect />
      </LinkSection>
    </StyledCard>
  );
};

export default Card;
