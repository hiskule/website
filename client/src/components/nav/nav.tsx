import React from "react";
import { StyledNavbar, StyledLogo, StyledHiSkuleLogoStandardYNR, NavMenu, NavItem } from "./nav.styled";
import Logo from '../../assets/hiskule_small.png'

const Nav: React.FC = () => {
  return (
    <StyledNavbar>
      <StyledLogo>
        <StyledHiSkuleLogoStandardYNR src={Logo} alt="HiSkule Logo" />
      </StyledLogo>
      
      <NavMenu>
        <NavItem onClick={()=>console.log("log")}>EVENTS</NavItem>
        <NavItem>TEAM</NavItem>
        <NavItem>GET INVOLVED</NavItem>
        <NavItem>CONTACT US</NavItem>
      </NavMenu>
    </StyledNavbar>
  );
};

export default Nav;
