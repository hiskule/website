import React, { useState, useRef } from "react";
import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { motion } from "framer-motion";
import styled from "styled-components";

export const SocialLinks = styled.div`
  width: 100%;
  height: 65%;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

export const MotionLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f3;
  color: #000063;
  border-radius: 50%;
  padding: 30px;
  cursor: pointer;
  font-size: 3rem;
  z-index: 10;
`;

export const Tooltip = styled(motion.div)`
  position: absolute;
  background-color: #000063;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 15;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
`;

export const BubbleWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

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
