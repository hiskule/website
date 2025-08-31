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
