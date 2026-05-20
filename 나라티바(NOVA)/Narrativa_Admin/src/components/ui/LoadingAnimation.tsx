import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/animations/loading.json';

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Lottie
        {...defaultOptions}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default React.memo(LoadingAnimation);