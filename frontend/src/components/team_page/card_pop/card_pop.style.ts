import styled from "styled-components";

export const PopupWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;

  > div {
    width: 80%;
    height: 60%;
    background: linear-gradient(198deg, #000063 0%, white 70%);
    border-radius: 2rem;
    padding: 1rem;

    @media (max-width: 760px) {
      height: 80%;
    }
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
  

  @media (max-width: 760px) {
    flex-direction: column;
  }
`

export const ContentCard = styled.div`
  width: 95%;
  max-width: 600px;
  border-radius: 1.5rem;
  padding: 1rem;
  text-align: left;
  gap: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 760px) {
    gap: 10px;
  }
`;


export const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
  margin: 0;

  @media (max-width: 760px) {
    font-size: 1.5rem;
  }
`;

export const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: black;
  line-height: 1.6;
  text-align: flex-start;
  margin: 0;

  @media (max-width: 760px) {
    font-size: 0.8rem;
  }
`;

export const Position = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin: 0;
  @media (max-width: 760px) {
    font-size: 1.2rem;
  }
`;

export const Image = styled.img`
  height: 70%;
  border-radius: 10px;
  @media (max-width: 760px) {
    height: 60%;
  }
`
