import React from "react";
import { FooterContainer, LeftContainer, DirectoryColumn, IconLink, MailLink, RightContainer, DirectoryItem, SocialLinks, ContactInfo } from "./footer.style";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaDiscord, } from "react-icons/fa";
import { SiLinktree } from 'react-icons/si';
import { PRIMARY_NAVIGATION, ROUTES } from '../../shared/config/routes';


const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;


  return (
    <FooterContainer>
      <LeftContainer>
        <DirectoryColumn>
          <DirectoryItem $highlight={currentPath === ROUTES.home} onClick={() => navigate(ROUTES.home)}>Home</DirectoryItem>
          {PRIMARY_NAVIGATION.map((item) => (
            <DirectoryItem key={item.path} $highlight={currentPath === item.path} onClick={() => navigate(item.path)}>
              {item.label}
            </DirectoryItem>
          ))}
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
            href="https://discord.gg/YsKmdBKRwD"
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
