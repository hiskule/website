import React from "react";
import { PopupWrapper,Logo,  ContentCard, Name, Position, Description } from "./card_pop.style";

interface PopupProps {
  data: { name: string; role: string; bio?: string };
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <PopupWrapper onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        <Logo src="https://placehold.co/10x10" alt="Logo" />
        <ContentCard>
          <Name>{data.name}</Name>
          <Position>{data.role}</Position>
          <Description>{data.bio || 'No bio available.'}</Description>
        </ContentCard>
      </div>
    </PopupWrapper>
  );
};

export default PopUp
