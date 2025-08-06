import React from 'react'
import Nav from '../components/nav/nav'
import Footer from '../components/footer/footer'
import styled from "styled-components"
import EventsSection from '../components/event_section/event_section'
import BigLogo from '../assets/hiskule_full.png'
import SmallLogo from '../assets/hiskule_small.png'


const StyledHomePage = styled.div`
  width: 100vw;        
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 80px;  
`;


const Event: React.FC = () => {

  return (
    <StyledHomePage>
        <Nav/>
        <EventsSection
            title="MENTORSHIP COFFEEHOUSE"
            time="EARLY FALL"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan magna et auctor tristique..."
            images={[BigLogo, SmallLogo, BigLogo,]}
            />
        <EventsSection
            title="MENTORSHIP COFFEEHOUSE"
            time="EARLY FALL"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan magna et auctor tristique..."
            images={[BigLogo, SmallLogo, BigLogo,]}
            />
        <Footer/>
    
    </StyledHomePage>
  )
}

export default Event