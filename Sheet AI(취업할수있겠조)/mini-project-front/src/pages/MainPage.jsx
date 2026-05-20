import BackgroundRemover from '@src/components/background/BackgroundRemover.jsx';
import SubmitButton from '@src/components/button/SubmitButton.jsx';
import FeatureTabs from '@src/components/common/FeatureTabs.jsx';
import InputImage from '@src/components/common/InputImage.jsx';
import EvaluataionLayout from '@src/components/layout/EvaluationLayout.jsx';
import InputLayout from '@src/components/layout/InputLayout.jsx';
import MainContainer from '@src/components/layout/MainContainer.jsx';
import { activeFeatureAtom } from '@src/config/atom';
import { useAtom } from 'jotai';
import React from 'react';

const MainPage = () => {
  const [activeFeature] = useAtom(activeFeatureAtom);

  return (
    <MainContainer>
      <FeatureTabs />
      <InputImage
        Layout={InputLayout}
        layoutProps={{ text: '이미지를 올려주세요' }}
      />

      {activeFeature === 'background' ? (
        <BackgroundRemover />
      ) : (
        <>
          <SubmitButton />
          <EvaluataionLayout />
        </>
      )}
    </MainContainer>
  );
};

export default MainPage;
