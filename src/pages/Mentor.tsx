import React from 'react'
import styled from "styled-components"
import * as mentorPic from '../assets/random_mentor_pic'
import {team, mentor} from '../assets/coffeehouse'

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

const Paragraph = styled.p`
  color: black;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.button`
  background: #000063;
  color: #ffd712;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.6rem 2rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  margin-top: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  text-align: left;
`
const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 20px;
  margin: 25px 0;
`

const SectionImageVertical = styled.img`

  width: 30%;
  height: auto;
  border-radius: 25px;

`

const SectionImageHorizontal = styled.img`

  width: 40%;
  height: auto;
  border-radius: 25px;

`
    

const Mentor: React.FC = () => {

  return (
    <StyledHomePage>
        <TopSection>
            <Header>MENTORS ARE OUR BACKBONE</Header>
            <SubHeader>
            Volunteer mentors are the lifeblood of our events. Without them, <strong>Hi-Skule™</strong> would be unable to run events at the scale we do.
            </SubHeader>
            <img src={team} alt="Hiskule Logo" style={{ width: '60%', height: 'auto', borderRadius: '30px'}} />
        </TopSection>


        <Section>
            <TextSection>
                <Header>MENTOR MAILING LIST SIGN UP</Header>
                <Paragraph>
                Become a mentor today and have the opportunity to guide young students who are curious about pursuing a career in STEM. By signing up to be a <strong>Hi-Skule™</strong> mentor you’ll be notified when volunteer signup is available for all <strong>Hi-Skule™</strong> Mentorship Events.
                </Paragraph>
                <Button >SIGN UP</Button>
            </TextSection>

            <SectionImageHorizontal src={mentor} />

        </Section >

        <Section>
            <SectionImageVertical src={mentorPic.eighth} />

            <TextSection>
                <Header>First Year Executive</Header>
                <Paragraph>
                Ready to make an impact as a first year? Join the 2T5-2T6 <strong>Hi-Skule™</strong> exec team today! Help recruit mentors and inspire the next generation of engineers
                </Paragraph>
                <Button >SIGN UP</Button>
            </TextSection>
        </Section >

        <Section>
            <TextSection>
                <Header>STAY INVOLED</Header>
                <Paragraph>
                Want to help out? Out next event is ..., Join us for our planning meeting on ... at ...! Can’t make it? Join our Discord to stay in the loop with all things <strong>Hi-Skule™</strong>!
                </Paragraph>
                <Button>RSVP FOR MEETING</Button>
                <Button>JOIN DISCORD</Button>
            </TextSection>

            <SectionImageVertical src={mentorPic.tenth} />
        </Section >
    </StyledHomePage>
  )
}

export default Mentor