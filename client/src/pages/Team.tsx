import React from 'react';
import Nav from '../components/nav/nav';
import styled from "styled-components";
import Footer from '../components/footer/footer';
import TeamCard from '../components/team_card/team_card';
import Card from '../components/card/card';
import PopUp from '../components/card_pop/card_pop';

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
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
interface CardData {
  name: string;
  role: string;
  bio?: string;
}
const cardData = [
  {name: 'Alice', role: 'Frontend Developer' },
  { name: 'Bob', role: 'UI/UX Designer' },
  { name: 'Charlie', role: 'Project Manager' },
  { name: 'Diana', role: 'Backend Developer' },
  { name: 'Ethan', role: 'DevOps Engineer' },
  { name: 'Fiona', role: 'QA Analyst' },
  { name: 'George', role: 'Full Stack Developer' },
  { name: 'Hannah', role: 'Product Owner' },
  { name: 'Isaac', role: 'Mobile Developer' },
  { name: 'Jade', role: 'Technical Writer' },
  { name: 'Kevin', role: 'Business Analyst' },
  { name: 'Lily', role: 'Security Specialist' },
  { name: 'Max', role: 'Scrum Master' }
];

const Team: React.FC = () => {
    const [popupData, setPopupData] = React.useState<CardData | null>(null);
  return (
    <StyledTeamPage>
      <Nav />
      <TeamCard />
      <MeetTheTeam>Meet the Team</MeetTheTeam>

      {/* First card alone */}
      <CardRow style={{ justifyContent: 'center' }}>
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

      {/* Popup */}
      {popupData && <PopUp data={popupData} onClose={() => setPopupData(null)} />}


      <Footer />
    </StyledTeamPage>
  );
};

export default Team;
