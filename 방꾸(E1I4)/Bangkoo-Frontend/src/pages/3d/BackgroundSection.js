import React from 'react';
import BackgroundUploader from '@/common/three/BackgroundUploader';
import ModelUploader from '@/common/upload/ModelUploader';
import { useBackgroundLoader } from '@/hooks/useBackgroundLoader';
import { useModelUploader } from '@/hooks/useModelUploader';

export default function BackgroundSection({ onBackgroundLoad, onCanvasSizeUpdate, onModelUpload }) {
  const handleBackgroundLoad = useBackgroundLoader(onBackgroundLoad, onCanvasSizeUpdate);
  const handleModelUpload = useModelUploader(onModelUpload);

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <BackgroundUploader onUpload={handleBackgroundLoad} />
      <ModelUploader onChange={handleModelUpload} />
    </div>
  );
}
