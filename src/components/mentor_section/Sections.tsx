import {Section, SectionImageHorizontal, SectionImageVertical, TextSection, Header, Paragraph, Button} from './Sections.style'


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