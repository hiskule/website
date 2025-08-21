import React from "react";
import Nav from "../components/nav/nav";
import Footer from "../components/footer/footer";
import FloatingImages from "../components/contact_page/floating_image/floating_image";
import SocialBubbles from "../components/contact_page/socialbubble/socialbubble";
import styled from "styled-components";

export const StyledContactPage = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(180deg, white 15%, #c5e5f7ff 100%);
  padding-top: 60px;
  overflow: hidden;
`;


export const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #000063;
  text-align: center;
  margin-bottom: 0;
  font-size: 2.5rem;
  position: relative;
  z-index: 10;
`;

const Contact: React.FC = () => {
  return (
    <StyledContactPage>
      {/* Background floating images */}

      <div style={{position: "relative", zIndex: '1'}}>
        <FloatingImages />
      </div>
      

      {/* Foreground content */}
      <Nav />
      <Title>Get In Touch!</Title>
      <SocialBubbles />
      <div style={{position: "relative", zIndex: '20'}}>
        <Footer />
      </div>
      
    </StyledContactPage>
  );
};

export default Contact;
