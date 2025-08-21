import React, { useEffect, useRef, useState } from "react";
import {Container, FixedSection, Title, Text, Trigger, Image} from './about.style'
import { aboutUsSection } from "../../../data/home";



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

  const { content, imageSrc } = aboutUsSection[activeIndex];

  return (
    <Container>
        
      <FixedSection>
        
          <div style={{display: 'flex', flexDirection:'column', width: '40%'}}>
            <Title>ABOUT US</Title>
            <Text dangerouslySetInnerHTML={{ __html: content }} />
          </div >
          
          <Image src={imageSrc}/>

      </FixedSection>

      {aboutUsSection.map((_, i) => (
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
