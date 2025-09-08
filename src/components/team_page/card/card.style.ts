import styled from "styled-components";


export const StyledCard = styled.div`
  background: white;
  border-radius: 2rem;
  width: 25%;
  min-width: 280px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
  max-width: 350px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 80%;
    min-width: 300px;
  }
`;


export const LinkSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;


export const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

export const Position = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
`

