import styled from "styled-components";

export const StyledBanner = styled.div`
  width: 100%;
  min-height: 80vh; 
  position: relative;
  background: linear-gradient(180deg, #000063 0%, #D9D9D9 100%);
  overflow: hidden; 
  flex-wrap: wrap;

  @media (max-width: 760px) {
    min-height: 50vh; 
  }
`;


export const StyledHiSkuleLogoStandardYNR = styled.img`
  width: 60vw;
  max-width: 600px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

