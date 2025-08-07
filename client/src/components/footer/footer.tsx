import React from "react";
import { FooterContainer, Directory, DirectoryColumn, DirectoryHeader, DirectoryItem, SocialLinks, ContactInfo } from "./footer.style";
import { useNavigate, useLocation } from "react-router-dom";


const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;


  return (
    <FooterContainer>
      <Directory>
        <DirectoryColumn>
          <DirectoryHeader>PAGE DIRECTORY</DirectoryHeader>
          <DirectoryItem highlight={currentPath === "/"} onClick={() =>  navigate("/")}>Home</DirectoryItem>
          <DirectoryItem highlight={currentPath === "/event"} onClick={() => navigate("/event")}>Events</DirectoryItem>
          <DirectoryItem highlight={currentPath === "/team"} onClick={() => navigate("/team")}>Meet the Team</DirectoryItem>
          <DirectoryItem onClick={() => navigate("/")}>Mentor Hub</DirectoryItem>
          <DirectoryItem onClick={() => navigate("/")}>Contact Us</DirectoryItem>
        </DirectoryColumn>
      </Directory>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <SocialLinks>LINKS TO SOCIALS</SocialLinks>

  <ContactInfo>
    Inquiries of the website can be sent to{" "}
    <a
      href="mailto:webmaster@hiskule.skule.ca"
      style={{ color: '#FFD712', textDecoration: 'none' }}
    >
      webmaster@hiskule.skule.ca
    </a>
  </ContactInfo>
</div>


      
    </FooterContainer>
  );
};

export default Footer;
