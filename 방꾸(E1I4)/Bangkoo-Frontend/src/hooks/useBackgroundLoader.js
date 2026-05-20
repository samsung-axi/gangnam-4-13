// hooks/useBackgroundLoader.js
export const useBackgroundLoader = (onLoad, onSize) => {
    return (url) => {
      const img = new Image();
      img.onload = () => {
        onSize({ width: img.naturalWidth, height: img.naturalHeight });
        onLoad(url);
      };
      img.src = url;
    };
  };
  