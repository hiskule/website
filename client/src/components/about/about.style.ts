import styled from "styled-components";
export const StyledABOUTUS = styled.span`
  color: #000063;
  font-size: 50px;
  font-weight: 700;
  word-wrap: break-word;
  font-family: "Inter", sans-serif;
`;

export const Container = styled.div`
  margin: 0 auto;
  padding: 50px 60px;
`;

export const FixedSection = styled.div`
  position: sticky;
  top: 100px;
  z-index: 10;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Text = styled.div`
  flex: 1;
  font-size: 1.75rem;
  font-family: "Inter", sans-serif;
`;

export const ImagePlaceholder = styled.div`
  flex: 1;
  height: 200px;
  background: #bbb;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 1.5rem;
  font-family: "Inter", sans-serif;
  user-select: none;
`;

export const Trigger = styled.div`
  height: 100vh;
`;