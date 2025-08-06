import styled from "styled-components";

export const StyledBanner = styled.div`
  width: 100vw;
  min-height: 80vh; 
  position: relative;
  background: linear-gradient(180deg, #000063 0%, #D9D9D9 100%);
  overflow: hidden; 
`;

export const StyledRectangle1 = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

export const StyledHiSkuleLogoStandardYNR = styled.img`
  width: 40vw;
  max-width: 600px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

