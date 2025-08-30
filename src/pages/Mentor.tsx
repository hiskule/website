import React from 'react'
import styled from "styled-components"
import {team} from '../assets/coffeehouse'
import mentorSections from '../data/mentor'
import SectionComponent from '../components/mentor_section/Sections'

const StyledHomePage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 60px;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



const Header = styled.h1`
  color: #000063;
  font-size: 2.5rem;
  font-weight: 700;
  margin-top:0;
`;

const SubHeader = styled.h2`
  color: black;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
`;





const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 20px;
  margin: 25px 0;
`



const Mentor: React.FC = () => {

  return (
    <StyledHomePage>
        <TopSection>
            <Header>MENTORS ARE OUR BACKBONE</Header>
            <SubHeader>
            Volunteer mentors are the lifeblood of our events. Without them, <strong>Hi-Skule™</strong> would be unable to run events at the scale we do.
            </SubHeader>
            <img src={team} style={{ width: '60%', height: 'auto', borderRadius: '30px'}} />
        </TopSection>


        {mentorSections.map((section, idx) => (
          <SectionComponent key={idx} data={section}/>
        ))} 

    </StyledHomePage>
  )
}

export default Mentor