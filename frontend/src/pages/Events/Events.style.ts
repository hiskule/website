import styled from "styled-components";

export const StyledEventPage = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 80px;
  dispaly: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    margin-left: 0;
  }
     
`;


export const EventRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 100px;
  width: 100%;
  position: relative; 
  z-index: 1;

  @media (max-width: 760px) {
    padding-bottom: 10px;
  }
`;

export const VerticalLine = styled.div`
  position: absolute;
  top: 100px;
  min-height: 10px;
  height: 1000px;
  left: 70px;
  width: 4px;
  background-color: #59A1C6;
  z-index: 2;


  @media (max-width: 760px) {
    display:none;
  }

`;

export const Dot = styled.div`
  width: 10px;
  height: 10px;
  background: #59A1C6;
  border: 4px solid #000063;
  border-radius: 50%;
  position: absolute; 
  z-index: 3; 
  left: 63px;


  @media (max-width: 760px) {
    display:none;
  }
`;

export const ExtraSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 150px;

  
  @media (max-width: 760px) {
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;

    padding-bottom: 30px;
  }
`


export const ExtraPhoto = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

`

export const Carou = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;

  @media (max-width: 760px) {
    width: 80%;
  }

`
