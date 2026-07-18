import React from "react";
import { motion } from "framer-motion";
import Logo from "../../../assets/hiskule_full.webp";
import SmallLogo from "../../../assets/hiskule_small.webp";

const floatingImages = [
  Logo, Logo, Logo, Logo, Logo, Logo,
  SmallLogo, SmallLogo, SmallLogo, SmallLogo, SmallLogo, SmallLogo,
];

const FloatingImages: React.FC = () => {
  return (
    <>
      {floatingImages.map((src, idx) => {
        const startX = Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000);
        const duration = 6 + Math.random() * 4;

        return (
          <motion.img
            key={idx}
            src={src}
            className="contact-floating-img"
            initial={{ y: 50, x: startX, rotate: 0 }}
            animate={{ y: [ (typeof window !== "undefined" ? window.innerHeight : 800) + 50, -50], rotate: [0, 360] }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </>
  );
};

export default FloatingImages;

