import React from 'react'
import Nav from '../components/nav/nav'
import styled from "styled-components"
import Footer from '../components/footer/footer'
import TeamCard from '../components/team_card/team_card'
import Card from '../components/card/card'


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

const Team: React.FC = () => {

  return (
    <StyledTeamPage>
        <Nav/>
        <TeamCard/>
        <MeetTheTeam>Meet the Team</MeetTheTeam>
        <Card/>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Card/><Card/><Card/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Card/><Card/><Card/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Card/><Card/><Card/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <Card/><Card/><Card/>
        </div>
        
        
        <Footer/>

    
    </StyledTeamPage>
  )
}

export default Team