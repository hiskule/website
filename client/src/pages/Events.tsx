import React from 'react'
import Nav from '../components/nav/nav'
import Footer from '../components/footer/footer'
import styled from "styled-components"
import EventsSection from '../components/event_section/event_section'
import BigLogo from '../assets/hiskule_full.png'
import SmallLogo from '../assets/hiskule_small.png'
import Carousel from '../components/carousel'

const StyledEventPage = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 80px;
  z-index: 0;
  position: relative;
`;

const EventRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  padding-bottom: 100px;

  position: relative; 
  z-index: 1;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 100px;
  min-height: 100vh;
  height: 830px;
  left: 27px;
  width: 4px;
  background-color: #59A1C6;
  z-index: 2;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #59A1C6;
  border: 4px solid #000063;
  border-radius: 50%;
  position: relative; 
  z-index: 3; 
`;

const Event: React.FC = () => {
  return (
    <StyledEventPage>
      <Nav />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EventRow>
            <Dot />
            <VerticalLine/>
          
          <EventsSection
            title="MENTORSHIP COFFEEHOUSE"
            time="EARLY FALL"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan magna et auctor tristique..."
            images={[BigLogo, SmallLogo, BigLogo]}
            showRegister={true}
          />
        </EventRow>
       

        <EventRow>
            <Dot />
          <EventsSection
            title="UNIVERSITY OF TORONTO HIGH SCHOOL DESIGN COMPETITION (UTHSDC)"
            time="LATE FALL"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan magna et auctor tristique..."
            images={[BigLogo, SmallLogo, BigLogo]}
            showRegister={false}
          />
        </EventRow>

        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '150px'}}>
           
           <h1>Stay tuned for more</h1>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly'}}>
                <Carousel images={[BigLogo, SmallLogo, BigLogo]}/>
                <Carousel images={[BigLogo, SmallLogo, BigLogo]}/>
            
            </div >
        
        </div>

      </div>

      <Footer />
    </StyledEventPage>
  )
}

export default Event
