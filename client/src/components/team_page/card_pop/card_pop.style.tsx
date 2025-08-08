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
    width: 70%;
    height: 500px;
    background: linear-gradient(198deg, #000063 0%, white 70%);
    border-radius: 2rem;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }
`;



export const ContentCard = styled.div`
  width: 90%;
  max-width: 600px;
  border-radius: 1.5rem;
  padding: 1rem;
  text-align: left;
  gap: 20px;
  display: flex;
  flex-direction: column;
`;

export const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: black;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: black;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
`;

export const Position = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: black;
  margin: 0;
`;

export const Logo = styled.img`
  width: 200px;
  height: auto;
  margin-top: 2rem;
`;