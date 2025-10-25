import styled from "styled-components"
export const StyledMentorPage = styled.div`
  width: 100vw;
  min-height: 100vh;    
  position: relative;
  background: linear-gradient(180deg, white 15%, #DBF1FD 100%);
  padding-top: 60px;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


export const Header = styled.h1`
  color: #000063;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-align: center;
  @media (max-width: 760px) {
    font-size: 2rem;
  }
`;

export const SubHeader = styled.h2`
  color: black;
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  @media (max-width: 760px) {
    font-size: 1.2rem;
  }
`;


export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 20px;
  margin: 25px 0;
`

export const Image = styled.img`
  width: 60%;
  height: auto;
  border-radius: 30px;

  @media (max-width: 760px) {
    width: 90%;
  }
`