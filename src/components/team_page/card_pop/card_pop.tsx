import React from "react";
import { PopupWrapper,  ContentCard, Name, Position, Description, CardWrapper, Image} from "./card_pop.style";

interface PopupProps {
  data: { name: string; role: string; bio: string; img: string; };
  onClose: () => void;
}

const PopUp: React.FC<PopupProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <PopupWrapper onClick={onClose}>
      <CardWrapper onClick={e => e.stopPropagation()}>
        <Image src={data.img}/>
        <ContentCard>
          <Name>{data.name}</Name>
          <Position>{data.role}</Position>
          <Description dangerouslySetInnerHTML={{ __html: data.bio }}/>
        </ContentCard>
      </CardWrapper>
    </PopupWrapper>
  );
};

export default PopUp
