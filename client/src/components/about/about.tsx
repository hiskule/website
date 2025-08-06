import React, { useEffect, useRef, useState } from "react";
import {Container, FixedSection, StyledABOUTUS, Text, ImagePlaceholder, Trigger} from './about.style'

const sections = [
  {
    id: "about",
    content: "This is some example content about the hiskule.",
    imagePlaceholderText: "Representative Images",
  },
  {
    id: "team",
    content: "Meet our amazing team that makes everything possible.",
    imagePlaceholderText: "Team Images",
  },
];


const About: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
            break;
          }
        }
      },
      {
        threshold: 0.6,
      }
    );

    triggerRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const { content, imagePlaceholderText } = sections[activeIndex];

  return (
    <Container>
        
      <FixedSection>
        <StyledABOUTUS>ABOUT US</StyledABOUTUS>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{content}</Text>
          <ImagePlaceholder>{imagePlaceholderText}</ImagePlaceholder>
        </div>
        
      </FixedSection>

      {sections.map((_, i) => (
        <Trigger
          key={i}
          data-index={i}
          ref={(el) => {
            triggerRefs.current[i] = el;
            }}

        />
      ))}
    </Container>
  );
};

export default About;
