import React from 'react';
import Nav from '../components/nav/nav';
import styled from "styled-components";
import Footer from '../components/footer/footer';
import TeamCard from '../components/team_page/team_card/team_card';
import Card from '../components/team_page/card/card';
import PopUp from '../components/team_page/card_pop/card_pop';
import { teamData, cardData } from '../data/team';

const StyledTeamPage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, #DBF1FD 15%, #000063 100%);
  padding-top: 60px;  
`;

const MeetTheTeam = styled.h2`
  font-size: 3.5rem;
  color: #000063;
  font-weight: 700;
  margin-top: 4rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

interface CardData {
  name: string;
  role: string;
  bio: string;
}


const Team: React.FC = () => {
    const [popupData, setPopupData] = React.useState<CardData | null>(null);
  return (
    <StyledTeamPage>
      <Nav />
      <TeamCard
        imageSrc={teamData.imageSrc}
        description={teamData.description}
      />
      <MeetTheTeam>Meet the Team</MeetTheTeam>

      {/* First card alone */}
      <CardRow>
        <Card data={cardData[0]} onClick={() => setPopupData(cardData[0])} />
      </CardRow>

      {/* Remaining cards in rows of 3 */}
      {Array.from({ length: 4 }, (_, i) => (
        <CardRow key={i}>
          {cardData.slice(1 + i * 3, 1 + (i + 1) * 3).map(card => (
            <Card key={card.name} data={card} onClick={() => setPopupData(card)} />
          ))}
        </CardRow>
      ))}

      {popupData && <PopUp data={popupData} onClose={() => setPopupData(null)} />}

      <Footer />
    </StyledTeamPage>
  );
};

export default Team;
