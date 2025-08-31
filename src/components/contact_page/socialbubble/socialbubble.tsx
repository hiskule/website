import React, { useState, useRef } from "react";
import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import {SocialLinks, BubbleWrapper, MotionLink, Tooltip} from './social.style'

const socials = [
  { icon: <FaInstagram />, link: "https://www.instagram.com/hiskule/", desc: "Follow us on Instagram" },
  { icon: <FaDiscord />, link: "https://discord.gg/YsKmdBKRwD", desc: "Join our Discord server" },
  { icon: <SiLinktree />, link: "https://linktr.ee/Hi_SKULE", desc: "All our links in one place" },
  { icon: <FaEnvelope />, link: "mailto:hiskule@skule.ca", desc: "Send us an email" }
];

const SocialBubbles: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  bubbleRefs.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el);
    }
  };

  return (
    <SocialLinks>
      {socials.map((s, i) => {
        let xOffset = 0, yOffset = 0, scale = 1;

        if (hoveredIndex === i) {
          yOffset = -10;
          scale = 1.25;
        } else if (hoveredIndex === i - 1) xOffset = 18;
        else if (hoveredIndex === i + 1) xOffset = -18;

        return (
          <BubbleWrapper key={i} ref={addToRefs}>
            <MotionLink
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              animate={{ x: xOffset, y: yOffset, scale }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              {s.icon}
            </MotionLink>

            {hoveredIndex === i && (
              <Tooltip
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {s.desc}
              </Tooltip>
            )}
          </BubbleWrapper>
        );
      })}
    </SocialLinks>
  );
};

export default SocialBubbles;
