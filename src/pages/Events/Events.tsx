import React from 'react';
import Nav from '../../components/nav/nav';
import Footer from '../../components/footer/footer';
import {StyledEventPage, Content, EventRow, Dot, VerticalLine, ExtraSection, ExtraPhoto, Carou} from './Events.style'
import EventsSection from '../../components/event_section/event_section';
import Carousel from '../../components/carousel/carousel';
import { eventsData } from '../../data/events';

import * as MentorPics from '../../assets/random_mentor_pic';





const Event: React.FC = () => {
  return (
    <StyledEventPage>
      <Nav />

      <Content>
        
        {eventsData.map((event, index) => (
          <EventRow key={index}>
            <Dot />
            <VerticalLine />
            <EventsSection {...event} />
          </EventRow>
        ))}

        <ExtraSection>
          <h1>Stay tuned for more</h1>
          <ExtraPhoto>
            <Carou>
              <Carousel images={[MentorPics.fifth,  MentorPics.third, MentorPics.seventh, MentorPics.ninth ]} />
            </Carou>

            <Carou>
              <Carousel images={[MentorPics.forth, MentorPics.second,  MentorPics.sixth, MentorPics.first,]} />
            </Carou>
         </ExtraPhoto>
        </ExtraSection>
      </Content>

      <Footer />
    </StyledEventPage>
  );
};

export default Event;
