import styled from "styled-components";

export const StyledSectionEvents = styled.div`
  margin: 0 auto;
  padding: 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    padding: 50px 40px;
  }
`;

export const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const Heading = styled.h2`
  color: #000063;
  font-size: 2.5rem;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;

  @media (max-width: 760px) {
    font-size: 2rem;
  }
`;

export const NotificationDot = styled.div`
  width: 12px;
  height: 12px;
  background: #e50e32;
  border-radius: 50%;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const BackgroundCard = styled.div`
  width: 60%;
  padding: 24px;
  background: #d9d9d9;
  border-radius: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 760px) {
    width: 100%;
  }

`;

export const Card = styled.div`
  width: 80%;
  padding-right: 8%;

  @media (max-width: 760px) {
    width: 100%;
    padding-right: 15%;
  }

`;

export const RegisterButton = styled.button`
  background: #000063;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #001199;
  }
`;

export const MoreEventsButton = styled.button`
  background: #000063;
  color: #ffd712;
  border: none;
  border-radius: 48px;
  padding: 12px 32px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 32px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;
