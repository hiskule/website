import React from 'react'
import Nav from '../components/nav/nav'
import styled from "styled-components"
import Footer from '../components/footer/footer'

const StyledContactPage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 60px;  
`;


const Contact: React.FC = () => {

  return (
    <StyledContactPage>
        <Nav/>
        <>ayayay</>
        <Footer/>
    </StyledContactPage>
  )
}

export default Contact