import React from 'react';
import Nav from '../components/nav/nav';
import Footer from '../components/footer/footer';
import styled from "styled-components";
import EventsSection from '../components/event_section/event_section';
import Carousel from '../components/carousel/carousel';
import { eventsData } from '../data/events';

import * as MentorPics from '../assets/random_mentor_pic';


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
  width: 100%;
  position: relative; 
  z-index: 1;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 100px;
  min-height: 100vh;
  height: 1000px;
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
  flex: 0 0 auto; 
`;



const Event: React.FC = () => {
  return (
    <StyledEventPage>
      <Nav />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10%' }}>
        
        {eventsData.map((event, index) => (
          <EventRow key={index}>
            <Dot />
            <VerticalLine />
            <EventsSection {...event} />
          </EventRow>
        ))}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '150px' }}>
          <h1>Stay tuned for more</h1>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
            <Carousel images={[MentorPics.fifth,  MentorPics.third, MentorPics.seventh, MentorPics.ninth ]} />
            <Carousel images={[MentorPics.forth, MentorPics.second,  MentorPics.sixth, MentorPics.first,]} />
          </div>
        </div>
      </div>

      <Footer />
    </StyledEventPage>
  );
};

export default Event;
