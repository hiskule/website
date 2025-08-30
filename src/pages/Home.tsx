import React from 'react'
import Hero from '../components/home_page/hero/hero'
import About from '../components/home_page/about/about'
import styled from "styled-components"
import EventCard from '../components/home_page/eventCard/eventCard'

const StyledHomePage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 60px;  
`;


const Home: React.FC = () => {

  return (
    <StyledHomePage>
      <Hero/>
      <About/>
      <EventCard/>
    </StyledHomePage>
  )
}

export default Home