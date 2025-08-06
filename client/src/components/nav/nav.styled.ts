import styled from "styled-components";

export const StyledNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #000063;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1000; /* stay on top */
`;


export const StyledLogo = styled.div`
  flex-shrink: 0;
`;

export const StyledHiSkuleLogoStandardYNR = styled.img`
  width: 130px;   /* scaled logo */
  height: auto;
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 2rem;  
  padding: 0 20px;
`;





export const NavItem = styled.p<{ highlight?: boolean }>`
  color: white;
  font-weight: ${({ highlight }) => (highlight ? 400 : 700)};
  font-size: 1.5rem;
  cursor: pointer;
  white-space: nowrap; 
  user-select: none;
  font-family: 'Inter', sans-serif;
  color: ${({ highlight }) => (highlight ? "#FFD712" : "white")};

  &:hover {
    opacity: 0.8;
  }
`;