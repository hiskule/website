import React from 'react'
import {team} from '../../assets/coffeehouse'
import mentorSections from '../../data/mentor'
import SectionComponent from '../../components/mentor_section/Sections'
import {StyledMentorPage, TopSection, Header, SubHeader, Image} from './Mentor.style'

const Mentor: React.FC = () => {

  return (
    <StyledMentorPage>
      <TopSection>
        <Header>MENTORS ARE OUR BACKBONE</Header>
        <SubHeader>
        Volunteer mentors are the lifeblood of our events. Without them, <strong>Hi-Skule™</strong> would be unable to run events at the scale we do.
        </SubHeader>
        <Image src={team}/>
      </TopSection>


      {mentorSections.map((section, idx) => (
        <SectionComponent key={idx} data={section}/>
      ))} 
    </StyledMentorPage>
  )
}

export default Mentor