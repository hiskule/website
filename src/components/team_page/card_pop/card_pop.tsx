import React from "react";
import { PopupWrapper,  ContentCard, Name, Position, Description, CardWrapper} from "./card_pop.style";

interface PopupProps {
  data: { name: string; role: string; bio?: string; img: string; };
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <PopupWrapper onClick={onClose}>
      <CardWrapper onClick={e => e.stopPropagation()}>
        <img src={data.img} style={{height: '70%', borderRadius: '10px'}}/>
        <ContentCard>
          <Name>{data.name}</Name>
          <Position>{data.role}</Position>
          <Description>{data.bio || 'No bio available.'}</Description>
        </ContentCard>
      </CardWrapper>
    </PopupWrapper>
  );
};

export default PopUp
