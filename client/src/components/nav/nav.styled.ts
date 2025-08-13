import styled from "styled-components";

export const StyledNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; 
  background: #000063;
  display: flex;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  z-index: 1000;

  @media (max-width: 760px) {
    justify-content: space-between;
  }
`;

export const StyledLogo = styled.div`
  flex-shrink: 0;
`;

export const StyledHiSkuleLogoStandardYNR = styled.img`
  width: 100px; 
  height: auto;
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 1.2rem; 
  padding: 0 12px; 

  @media (max-width: 760px) {
    display: none; /* hide on mobile */
  }
`;

export const NavItem = styled.p<{ $highlight?: boolean }>`
  color: ${({ $highlight }) => ($highlight ? "#FFD712" : "white")};
  font-size: 1.1rem; /* ⬅️ smaller font size */
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  font-family: 'Inter', sans-serif;

  &:hover {
    font-weight: 700;
  }

  @media (max-width: 760px) {
    color: ${({ $highlight }) => ($highlight ? "#FFD712" : "black")};
    margin: 0;
  }
`;

export const HamburgerButton = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;

  @media (max-width: 760px) {
    display: block;
  }
`;

/* Overlay for drawer */
export const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 99;
`;

/* Sliding drawer from the right */
export const MobileDrawer = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 240px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  gap: 1.5rem;
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 100;
`;
