import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

const socials = [
  { icon: <FaInstagram />, link: "https://www.instagram.com/hiskule/", desc: "Follow us on Instagram" },
  { icon: <FaDiscord />, link: "https://discord.gg/YsKmdBKRwD", desc: "Join our Discord server" },
  { icon: <SiLinktree />, link: "https://linktr.ee/Hi_SKULE", desc: "All our links in one place" },
  { icon: <FaEnvelope />, link: "mailto:hiskule@skule.ca", desc: "Send us an email" }
];

const SocialBubbles: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el);
    }
  };

  return (
    <div className="social-links-row">
      {socials.map((s, i) => {
        let xOffset = 0, yOffset = 0, scale = 1;

        if (hoveredIndex === i) {
          yOffset = -10;
          scale = 1.25;
        } else if (hoveredIndex === i - 1) xOffset = 18;
        else if (hoveredIndex === i + 1) xOffset = -18;

        return (
          <div key={i} className="social-bubble-wrapper" ref={addToRefs}>
            <motion.a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="social-motion-link"
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              animate={{ x: xOffset, y: yOffset, scale }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
            >
              {s.icon}
            </motion.a>

            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  className="social-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {s.desc}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default SocialBubbles;

