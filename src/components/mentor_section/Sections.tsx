import styled from "styled-components"
const SectionImageVertical = styled.img`

  width: 30%;
  height: auto;
  border-radius: 25px;

  @media (max-width: 760px) {
    width: 80%;
  }

`

const SectionImageHorizontal = styled.img`

  width: 40%;
  height: auto;
  border-radius: 25px;

  @media (max-width: 760px) {
    width: 80%;
  }

`

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
  text-align: left;

  @media (max-width: 760px) {
    width: 80%;
  }
`

const Section = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 40px;


  @media (max-width: 760px) {
    flex-direction: column;
    gap: 20px;
  }


`;

const Paragraph = styled.p`
  color: black;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 800px;
  margin: 0 auto;

    @media (max-width: 760px) {
   font-size: 1rem;
  }
`;

const Header = styled.h1`
  color: #000063;
  font-size: 2.5rem;
  font-weight: 700;
  margin-top:0;

  @media (max-width: 760px) {
   font-size: 2rem;
  }
`;

export const Button = styled.button<{ $hasLink?: boolean }>`
  background: ${({ $hasLink }) => ($hasLink ? "#000063" : "#fff")};
  color: ${({ $hasLink }) => ($hasLink ? "#ffd712" : "#000")};
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.6rem 2rem;
  border-radius: 2rem;
  border: none;
  cursor: ${({ $hasLink }) => ($hasLink ? "pointer" : "default")};
  margin-top: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    opacity: ${({ $hasLink }) => ($hasLink ? 0.8 : 1)};
  }
`;

type ButtonType = {
  label: string;
  link?: string; 
};

type ImageType = {
  src: string;
  type: "horizontal" | "vertical";
  position: "left" | "right";
};

type MentorSection = {
  header: string;
  text: string;
  buttons: ButtonType[];
  image?: ImageType;
};

type SectionsProps = { data: MentorSection };



const SectionComponent: React.FC <SectionsProps> = ( {data} ) => {
  return (
    <Section>

      {data.image?.position === "left" && (
          data.image.type === "horizontal"
          ? <SectionImageHorizontal src={data.image.src} />
          : <SectionImageVertical src={data.image.src} />
      )}

      <TextSection>
        <Header>{data.header}</Header>
        <Paragraph dangerouslySetInnerHTML={{ __html: data.text }} />

        {data.buttons.map((btn, bIdx) => (
            <Button 
            key={bIdx} 
            $hasLink={!!btn.link}  
            onClick={() => {
                if (btn.link) window.open(btn.link, "_blank");
            }}>
                {btn.label}
            </Button>
        ))}
      </TextSection>

      {data.image?.position === "right" && (
      data.image.type === "horizontal"
          ? <SectionImageHorizontal src={data.image.src} />
          : <SectionImageVertical src={data.image.src} />
      )}
    </Section>
  );
    
        
  
};

export default SectionComponent;