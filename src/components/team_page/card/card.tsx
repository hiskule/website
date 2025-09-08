import React from "react";
import {
  StyledCard,
  Text,
  Name,
  Position,
  LinkSection,
} from "./card.style";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

interface CardProps {
  data: {
    name: string;
    role: string;
    emaillink: string;
    link: string;
    img: string;
  };
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ data, onClick }) => {
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <StyledCard
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onClick) {
          onClick();
        }
      }}
    >
      <img src={data.img} />

      <Text>
        <Name>{data.name}</Name>
        <Position>{data.role}</Position>
      </Text>

      <LinkSection>
        <a
          href={data.emaillink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleIconClick}
        >
          <FaEnvelope size={48} color="#000063" />
        </a>

        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleIconClick}
        >
          <FaLinkedin size={48} color="#000063" />
        </a>
      </LinkSection>
    </StyledCard>
  );
};

export default Card;
