// pages/3d/Canvas3DSection.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FixedBackground from '@/common/three/FixedBackground';
import Model from '@/components/canvas/model/Model'; 

export default function Canvas3DSection({ background, modelUrl, canvasSize, showMask, showHelper }) {
  return (
    <div
      style={{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* 배경 이미지 */}
      {background && (
        <FixedBackground
          imageUrl={background}
          style={{
            objectFit: 'cover',
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}

      {/* 3D 캔버스 */}
      <Canvas
        camera={{ position: [0, 1.2, 4], fov: 45 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          {modelUrl && <Model url={modelUrl} showMask={showMask} showHelper={showHelper} />}
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
