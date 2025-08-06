import React from 'react'
import Nav from '../components/nav/nav'
import Footer from '../components/footer/footer'
import styled from "styled-components"


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
        <Footer/>
    
    </StyledHomePage>
  )
}

export default Event