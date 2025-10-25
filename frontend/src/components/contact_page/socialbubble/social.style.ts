import styled from "styled-components";
import { motion } from "framer-motion";

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
