import React from "react";
import Logo from "../../assets/hiskule_full.png";
import SmallLogo from "../../assets/hiskule_small.png";
import styled from "styled-components";
import { motion } from "framer-motion";

export const FloatingImageStyled = styled(motion.img)`
  position: absolute;
  width: 50px;
  pointer-events: none;
  z-index: 0;
  top: 0;
  left: 0;
`;

const floatingImages = [
  Logo, Logo, Logo, Logo, Logo, Logo,
  SmallLogo, SmallLogo, SmallLogo, SmallLogo, SmallLogo, SmallLogo,
];

const FloatingImages: React.FC = () => {
  return (
    <>
      {floatingImages.map((src, idx) => {
        const startX = Math.random() * window.innerWidth;
        const duration = 6 + Math.random() * 4;

        return (
          <FloatingImageStyled
            key={idx}
            src={src}
            initial={{ y: 50, x: startX, rotate: 0 }}
            animate={{ y: [ window.innerHeight + 50, -50], rotate: [0, 360] }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </>
  );
};

export default FloatingImages;
