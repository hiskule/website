import React from "react";
import FloatingImages from "../../components/contact_page/floating_image/floating_image";
import SocialBubbles from "../../components/contact_page/socialbubble/socialbubble";
import {StyledContactPage, FloatingWrap, Content, Title} from './Contact.style'

const Contact: React.FC = () => {
  return (
    <StyledContactPage>

      {/* Background floating images */}
      <FloatingWrap>
        <FloatingImages />
      </FloatingWrap>
      
      {/* Foreground content */}
      <Content>
        <Title>Get In Touch!</Title>
       <SocialBubbles />
      </Content>
      
    </StyledContactPage>
  );
};

export default Contact;
