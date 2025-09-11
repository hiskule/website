import React from 'react';
import TeamCard from '../../components/team_page/team_card/team_card';
import Card from '../../components/team_page/card/card';
import PopUp from '../../components/team_page/card_pop/card_pop';
import { teamData, cardData } from '../../data/team';
import {StyledTeamPage, MeetTheTeam, CardRow}from './Team.style'

interface CardData {
  name: string;
  role: string;
  bio: string;
  img: string;

}


const Team: React.FC = () => {
  const [popupData, setPopupData] = React.useState<CardData | null>(null);

  return (
    <StyledTeamPage>
      <TeamCard
        imageSrc={teamData.imageSrc}
        description={teamData.description}
      />

      <MeetTheTeam>Meet the Team</MeetTheTeam>
      
      <CardRow>
        {cardData.map(card => (
          <Card key={card.name} data={card} onClick={() => setPopupData(card)} />
        ))}
      </CardRow>

      {popupData && <PopUp data={popupData} onClose={() => setPopupData(null)} />}

    </StyledTeamPage>
  );
};

export default Team;
