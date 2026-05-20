// FurnitureEditorContainer.js
import React, { useState } from 'react';
import BackgroundSection from './BackgroundSection';
import Canvas3DSection from '@/pages/3d/Canvas3DSection';
import ActionSection from './ActionSection';

export default function FurnitureEditorContainer() {
  const [background, setBackground] = useState(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1024, height: 768 });
  const [showMask, setShowMask] = useState(false);
  const [showHelper, setShowHelper] = useState(true);

  return (
    <>
      <BackgroundSection
        onBackgroundLoad={setBackground}
        onCanvasSizeUpdate={setCanvasSize}
        onModelUpload={setModelUrl}
      />

      <Canvas3DSection
        background={background}
        modelUrl={modelUrl}
        canvasSize={canvasSize}
        showMask={showMask}
        showHelper={showHelper}
      />

      <ActionSection
        background={background}
        modelUrl={modelUrl}
        canvasSize={canvasSize}
        setShowMask={setShowMask}
        setShowHelper={setShowHelper}
      />
    </>
  );
}
