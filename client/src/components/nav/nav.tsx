import React from "react";
import { StyledNavbar, StyledLogo, StyledHiSkuleLogoStandardYNR, NavMenu, NavItem } from "./nav.styled";
import Logo from '../../assets/hiskule_small.png'
import { useNavigate, useLocation } from "react-router-dom";

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <StyledNavbar>
      <StyledLogo>
        <StyledHiSkuleLogoStandardYNR src={Logo} alt="HiSkule Logo" onClick={() =>  navigate("/")}/>
      </StyledLogo>
      
      <NavMenu>
        <NavItem highlight={currentPath === "/event"} onClick={() =>  navigate("/event")}>EVENTS</NavItem>
        <NavItem highlight={currentPath === "/team"} onClick={() =>  navigate("/team")}>TEAM</NavItem>
        <NavItem highlight={currentPath === "/mentor"} onClick={() =>  navigate("/mentor")}>GET INVOLVED</NavItem>
        <NavItem>CONTACT US</NavItem>
      </NavMenu>
    </StyledNavbar>
  );
};

export default Nav;
