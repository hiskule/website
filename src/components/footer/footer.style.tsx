import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  margin: 0 auto;
  background: #000038;
  color: white;
  padding: 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

`;


export const LeftContainer = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const IconLink = styled.a`
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: #FFD712;
  }
`;

      
export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`; 

export const DirectoryColumn = styled.div`
  flex: 1 1 120px;
  min-width: 120px;
`;


export const DirectoryItem = styled.p<{ $highlight?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: ${({ $highlight }) => ($highlight ? 400 : 700)};
  font-size: 14px;
  color: ${({ $highlight }) => ($highlight ? "#FFD712" : "white")};
  margin: 6px 0;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
  }
`;


export const ContactInfo = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: white;
  user-select: text;
`;


export const MailLink = styled.a`
  color: #FFD712;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;