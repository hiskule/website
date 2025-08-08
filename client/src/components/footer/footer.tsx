import React from "react";
import { FooterContainer, LeftContainer, DirectoryColumn, IconLink, MailLink, RightContainer, DirectoryItem, SocialLinks, ContactInfo } from "./footer.style";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaDiscord, FaFacebook, FaYoutube } from "react-icons/fa";


const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;


  return (
    <FooterContainer>
      <LeftContainer>
        <DirectoryColumn>
          <DirectoryItem $highlight={currentPath === "/"} onClick={() =>  navigate("/")}>Home</DirectoryItem>
          <DirectoryItem $highlight={currentPath === "/event"} onClick={() => navigate("/event")}>Events</DirectoryItem>
          <DirectoryItem $highlight={currentPath === "/team"} onClick={() => navigate("/team")}>Meet the Team</DirectoryItem>
          <DirectoryItem $highlight={currentPath === "/mentor"} onClick={() => navigate("/mentor")}>Mentor Hub</DirectoryItem>
          <DirectoryItem onClick={() => navigate("/")}>Contact Us</DirectoryItem>
        </DirectoryColumn>
      </LeftContainer>

      <RightContainer>
        <SocialLinks>
          <IconLink
            href="https://www.instagram.com/hiskule/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={48} />
          </IconLink>

          <IconLink
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord size={48} />
          </IconLink>

          <IconLink
            href="https://www.facebook.com/hiskule/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={48}/>
          </IconLink>

          <IconLink
            href="https://youtu.be/sQfct_peGRs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={48} />
          </IconLink>
        </SocialLinks>

        <ContactInfo>
          Inquiries of the website can be sent to{" "}
          <MailLink href="mailto:webmaster@hiskule.skule.ca">
            webmaster@hiskule.skule.ca
          </MailLink>
        </ContactInfo>
      </RightContainer>


      
    </FooterContainer>
  );
};

export default Footer;
