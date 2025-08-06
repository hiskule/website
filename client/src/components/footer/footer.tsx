import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FooterContainer = styled.footer`
  width: 100%;
  margin: 0 auto;
  background: #000038;
  color: white;
  padding: 24px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between

`;

const Directory = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const DirectoryColumn = styled.div`
  flex: 1 1 120px;
  min-width: 120px;
`;

const DirectoryHeader = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
  color: white;
`;

const DirectoryItem = styled.p<{ highlight?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: ${({ highlight }) => (highlight ? 400 : 700)};
  font-size: 14px;
  color: ${({ highlight }) => (highlight ? "#FFD712" : "white")};
  margin: 6px 0;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SocialLinks = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: white;
  margin-bottom: 24px;
`;

const ContactInfo = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: white;
  user-select: text;
`;

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <FooterContainer>
      <Directory>
        <DirectoryColumn>
          <DirectoryHeader>PAGE DIRECTORY</DirectoryHeader>
          <DirectoryItem highlight onClick={() => handleNavigate("/")}>Home</DirectoryItem>
          <DirectoryItem onClick={() => handleNavigate("/")}>Events</DirectoryItem>
          <DirectoryItem onClick={() => handleNavigate("/")}>Meet the Team</DirectoryItem>
          <DirectoryItem onClick={() => handleNavigate("/")}>Mentor Hub</DirectoryItem>
          <DirectoryItem onClick={() => handleNavigate("/")}>Contact Us</DirectoryItem>
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
