import styled from "styled-components";

export const StyledContactPage = styled.div`
  width: 100vw;
  min-height: 70vh;
  background: linear-gradient(180deg, white 15%, #c5e5f7ff 100%);
  padding-top: 60px;
  overflow: hidden;
  position: relative;

  @media (max-width: 760px) {
    min-height: 85vh;
  }

  
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  width: 90%;
  box-sizing: border-box;

  @media (max-width: 760px) {
    top: 53%;
  }
`

export const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #000063;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  position: relative;
  z-index: 10;
`;

export const FloatingWrap = styled.div`
  position: relative;
  z-index: 1;
`