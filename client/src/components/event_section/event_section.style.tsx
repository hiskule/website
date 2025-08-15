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
`;

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
`



export const Title = styled.h1`
  font-size: 40px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: black;
  text-align: center;
  margin: 0px;
  align-self: flex-start;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 40px;
  }
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
    font-size: 40px;
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
  background: #000063;
  color: ${({ $showRegister }) => ($showRegister ? '#FFD712' : 'white')};
  font-size: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border: none;
  border-radius: 40px;
  padding: 16px 32px;
  cursor: pointer;
  transition: background 0.3s;
  width: fit-content;
  align-self: center;

  &:hover {
    background: ${({ $showRegister }) => ($showRegister ? '#000045' : '#000063')};
  }
`;