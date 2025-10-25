import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  box-sizing: border-box;
  align-items: center;

  @media (max-width: 760px) {
    flex-direction: column;
    gap:20px;
    align-items: center;
    width: 100%;

    padding: 20px 20px;
  }

`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  flex: 0 0 35%;

  @media (max-width: 760px) {
    width: 100%;
  }
`

export const RightContainer = styled.div`
  width: 40%;
  object-fit: contain;
  display: flex;
  justify-content: center;

  @media (max-width: 760px) {
    width: 90%;
    align-items: center;
  }

`

export const Title = styled.h1`
  font-size: 30px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: black;
  text-align: center;
  margin: 0px;
  align-self: flex-start;
  text-align: left;


`;

export const Time = styled.p`
  font-size: 30px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: black;
  text-align: center;
  margin: 0px;
  align-self: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const Description = styled.p`
  font-size: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: black;
  text-align: center;
  max-width: 800px;
  margin-bottom: 40px;
  text-align: left;
  align-self: flex-start;


  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const RegisterButton = styled.button<{ $showRegister: boolean }>`
  background: ${({ $showRegister }) => ($showRegister ? "#000063" : "#fff")};
  color: ${({ $showRegister }) => ($showRegister ? "#ffd712" : "#000")};
  font-size: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border: 1px #000063 solid;
  border-radius: 40px;
  padding: 16px 32px;
  cursor: ${({ $showRegister }) => ($showRegister ? "pointer" : "default")};
  transition: background 0.3s;
  width: fit-content;
  align-self: center;

  &:hover {
    background: ${({ $showRegister })=> ($showRegister ? 0.8 : 1)};
  }
`;

