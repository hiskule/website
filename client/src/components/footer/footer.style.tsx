import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  margin: 0 auto;
  background: #000038;
  color: white;
  padding: 24px;
  padding-right: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between
  

`;

export const Directory = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

export const DirectoryColumn = styled.div`
  flex: 1 1 120px;
  min-width: 120px;
`;

export const DirectoryHeader = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
  color: white;
`;

export const DirectoryItem = styled.p<{ highlight?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: ${({ highlight }) => (highlight ? 400 : 700)};
  font-size: 14px;
  color: ${({ highlight }) => (highlight ? "#FFD712" : "white")};
  margin: 6px 0;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const SocialLinks = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: white;
  margin-bottom: 24px;
`;

export const ContactInfo = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: white;
  user-select: text;
`;
