import styled from "styled-components";

export const Title = styled.div`
  color: #000063;
  font-size: 3rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;

  @media (max-width: 760px) {
    font-size: 2rem;
  }

`;

export const Container = styled.div`
  padding: 50px 60px;

  @media (max-width: 760px) {
    padding-bottom: 0px;
  }
`;

export const FixedSection = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  
  @media (max-width: 760px) {
    display: none;
  }

`;

export const Text = styled.div`
  disply: flex;
  flex-direction: column;
  width: 40%;

  @media (max-width: 760px) {
    width: 100%;
  }

`


export const Content = styled.div`
  font-size: 1.5rem;
  font-family: "Inter", sans-serif;
  width: 100%;

  @media (max-width: 760px) {
    font-size: 1rem;
  }
`;



export const Trigger = styled.div`
  height: 100vh;
  @media (max-width: 760px) {
    display: none;
  }
`;

export const Image = styled.img`
  width: 40%;
  height: auto;
  object-fit: contain;

  @media (max-width: 760px) {
    width: 100%;
    border-radius: 10px;
    margin: 10px 0;
  }


`;

export const Mobile = styled.div`
  display: none;

  @media (max-width: 760px) {
    display: flex ;
    flex-direction: column;
  }
`;
