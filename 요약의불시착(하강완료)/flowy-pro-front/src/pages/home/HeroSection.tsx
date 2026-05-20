import React from 'react';

import { CenteredText, Content, Hero } from './HeroSection.styles';

const HeroSection: React.FC = () => {
  return (
    <Hero>
      <Content>
        <CenteredText>
          회의하세요,
          <br />
          나머진 저희가 할게요.
        </CenteredText>
      </Content>
    </Hero>
  );
};

export default HeroSection;
