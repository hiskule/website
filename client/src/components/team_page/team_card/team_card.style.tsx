import styled from 'styled-components';

export const OurMissionContainer = styled.div`
  background: white;
  border-radius: 2rem;
  margin: 0 auto;
  width: 70%;
  margin-top: 40px ;

  @media (max-width: 760px) {
   width: 90%;
  }

`;


export const Section = styled.div`
  padding: 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 100%;
`;