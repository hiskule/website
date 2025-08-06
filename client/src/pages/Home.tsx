import React from 'react'
import Hero from '../components/hero/hero'
import Nav from '../components/nav/nav'
import About from '../components/about/about'
import styled from "styled-components"
import Footer from '../components/footer/footer'
import EventCard from '../components/home_eventCard/home_eventCard'

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
        <Nav/>
        <Hero/>
        <About/>
        <EventCard/>
        <Footer/>

    
    </StyledHomePage>
  )
}

export default Home