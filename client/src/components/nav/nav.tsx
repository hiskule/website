import React, { useState } from "react";
import {
  StyledNavbar,
  StyledLogo,
  StyledHiSkuleLogoStandardYNR,
  NavMenu,
  NavItem,
  HamburgerButton,
  MobileDrawer,
  DrawerOverlay
} from "./nav.styled";
import Logo from "../../assets/hiskule_small.png";
import { useNavigate, useLocation } from "react-router-dom";

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false); // close drawer after navigating
  };



  return (
    <StyledNavbar>
      <StyledLogo>
        <StyledHiSkuleLogoStandardYNR
          src={Logo}
          alt="HiSkule Logo"
          onClick={() => navigate("/")}
        />
      </StyledLogo>

      {/* Desktop Menu */}
      <NavMenu>
        <NavItem $highlight={currentPath === "/event"} onClick={() => handleNavClick("/event")}>EVENTS</NavItem>
        <NavItem $highlight={currentPath === "/team"} onClick={() => handleNavClick("/team")}>TEAM</NavItem>
        <NavItem $highlight={currentPath === "/mentor"} onClick={() => handleNavClick("/mentor")}>GET INVOLVED</NavItem>
        <NavItem>CONTACT US</NavItem>
      </NavMenu>

      {/* Hamburger for mobile */}
      <HamburgerButton onClick={() => setIsOpen(true)}>
        ☰
      </HamburgerButton>

      {/* Drawer Overlay */}
      {isOpen && <DrawerOverlay onClick={() => setIsOpen(false)} />}

      {/* Mobile Drawer */}
      <MobileDrawer $open={isOpen}>
        <NavItem $highlight={currentPath === "/"} onClick={() => handleNavClick("/")}>HOME</NavItem>
        <NavItem $highlight={currentPath === "/event"} onClick={() => handleNavClick("/event")}>EVENTS</NavItem>
        <NavItem $highlight={currentPath === "/team"} onClick={() => handleNavClick("/team")}>TEAM</NavItem>
        <NavItem $highlight={currentPath === "/mentor"} onClick={() => handleNavClick("/mentor")}>GET INVOLVED</NavItem>
        <NavItem>CONTACT US</NavItem>
      </MobileDrawer>
    </StyledNavbar>
  );
};

export default Nav;

