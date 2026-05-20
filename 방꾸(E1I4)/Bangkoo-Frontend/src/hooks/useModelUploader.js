// hooks/useModelUploader.js
export const useModelUploader = (onUpload) => {
    return (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onUpload(url);
      }
    };
  };
  