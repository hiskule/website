import React from "react";
import { FooterContainer, LeftContainer, DirectoryColumn, IconLink, MailLink, RightContainer, DirectoryItem, SocialLinks, ContactInfo } from "./footer.style";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaDiscord, } from "react-icons/fa";
import { SiLinktree } from 'react-icons/si';


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
          <DirectoryItem $highlight={currentPath === "/contact"} onClick={() => navigate("/contact")}>Contact us</DirectoryItem>
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
            href="https://linktr.ee/Hi_SKULE?fbclid=PAZXh0bgNhZW0CMTEAAaeP28ssAJ_XVYPCTXS7dq-JrQCjxQFddJ1IWeUuotGRN9yFsJEPAeTvDTnsDQ_aem_RhAdlKz1emDW4KLh0V68gA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiLinktree size={42} />
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
