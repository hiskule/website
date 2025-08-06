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
`;

export const NavItem = styled.p<{ highlight?: boolean }>`
  color: ${({ highlight }) => (highlight ? "#FFD712" : "white")};
  font-size: 1.1rem; /* ⬅️ smaller font size */
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  font-family: 'Inter', sans-serif;

  &:hover {
    font-weight: 700;
  }
`;
