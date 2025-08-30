import React from "react";
import {StyledHiSkuleLogoStandardYNR , StyledBanner} from "./hero.style";
import Logo from '../../../assets/hiskule_full.png'



const Hero: React.FC = () => {
  return (
    <StyledBanner>
      <StyledHiSkuleLogoStandardYNR  src={Logo}/>
    </StyledBanner>
  );
};

export default Hero

