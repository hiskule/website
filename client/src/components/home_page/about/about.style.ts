import styled from "styled-components";

export const Title = styled.div`
  color: #000063;
  font-size: 3rem;
  font-weight: 700;
  font-family: "Inter", sans-serif;
`;

export const Container = styled.div`
  padding: 50px 60px;
`;

export const FixedSection = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const Text = styled.div`
  font-size: 1.5rem;
  font-family: "Inter", sans-serif;
`;



export const Trigger = styled.div`
  height: 100vh;
`;

export const Image = styled.img`
  width: 40%;
  border: 1px solid red;
`;