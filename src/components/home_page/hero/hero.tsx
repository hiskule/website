import React from "react";
import { StyledRectangle1, StyledHiSkuleLogoStandardYNR , StyledBanner} from "./hero.style";
import Logo from '../../../assets/hiskule_full.png'



const Hero: React.FC = () => {
  return (
    <StyledBanner>
      <StyledRectangle1 />
      <StyledHiSkuleLogoStandardYNR  src={Logo}/>
    </StyledBanner>
  );
};

export default Hero

