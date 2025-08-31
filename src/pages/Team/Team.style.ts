import styled from "styled-components";

export const StyledTeamPage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  background: linear-gradient(180deg, #DBF1FD 15%, #000063 100%);
  padding-top: 60px;  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MeetTheTeam = styled.h2`
  font-size: 3.5rem;
  color: #000063;
  font-weight: 700;
  margin-top: 4rem;
  margin-bottom: 2rem;
  text-align: center;
  width: 90%;

  @media (max-width: 760px) {
    font-size: 2.5rem;
  }
  
`;

export const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
