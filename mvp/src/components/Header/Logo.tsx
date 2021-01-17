import React from "react";
import styled from "styled-components";
import Ribbon from "../../img/RibbonLogo.png";

const LogoContainer = styled.div``;

const Logo = () => {
  return (
    <LogoContainer>
      <a href="/">
        <img src={Ribbon} alt="" width="120"></img>
      </a>
    </LogoContainer>
  );
};

export default Logo;