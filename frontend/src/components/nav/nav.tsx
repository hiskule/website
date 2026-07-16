import React, { useState } from "react";
import {
  StyledNavbar,
  StyledHiSkuleLogo,
  NavMenu,
  NavItem,
  HamburgerButton,
  MobileDrawer,
  DrawerOverlay
} from "./nav.styled";
import Logo from "../../assets/hiskule_small.webp";
import { useNavigate, useLocation } from "react-router-dom";
import { PRIMARY_NAVIGATION, ROUTES } from "../../shared/config/routes";

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
      <StyledHiSkuleLogo src={Logo} alt="Hi-Skule home" onClick={() => navigate(ROUTES.home)}/>

      {/* Desktop Menu */}
      <NavMenu>
        {PRIMARY_NAVIGATION.map((item) => (
          <NavItem key={item.path} $highlight={currentPath === item.path} onClick={() => handleNavClick(item.path)}>
            {item.label}
          </NavItem>
        ))}
      </NavMenu>

      {/* Hamburger for mobile */}
      <HamburgerButton aria-label="Open navigation" onClick={() => setIsOpen(true)}>
        ☰
      </HamburgerButton>

      {/* Drawer Overlay */}
      {isOpen && <DrawerOverlay onClick={() => setIsOpen(false)} />}

      {/* Mobile Drawer */}
      <MobileDrawer $open={isOpen}>
        <NavItem $highlight={currentPath === ROUTES.home} onClick={() => handleNavClick(ROUTES.home)}>HOME</NavItem>
        {PRIMARY_NAVIGATION.map((item) => (
          <NavItem key={item.path} $highlight={currentPath === item.path} onClick={() => handleNavClick(item.path)}>
            {item.label}
          </NavItem>
        ))}
      </MobileDrawer>
    </StyledNavbar>
  );
};

export default Nav;
