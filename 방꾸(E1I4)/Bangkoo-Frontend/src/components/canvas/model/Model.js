// components/canvas/model/Model.js
import React, { useRef } from 'react';
import { useGLTF, TransformControls } from '@react-three/drei';
import { useModelTransform } from './useModelTransform';
import { useHelpers } from './useHelpers';
import { useEdgeEffect } from './useEdgeEffect';

export default function Model({ url, showMask, showHelper = false, enableTransform = false }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useModelTransform(scene);
  const boxHelper = useHelpers(scene, showHelper);
  const edges = useEdgeEffect(scene, showMask); // ✅ 기존 훅 사용

  const model = <primitive object={scene} ref={modelRef} dispose={null} />;

  return (
    <>
      {enableTransform ? (
        <TransformControls object={scene}>{model}</TransformControls>
      ) : (
        model
      )}
      {showHelper && boxHelper && <primitive object={boxHelper} />}
      {showMask && edges.map((edge, i) => (
        <primitive key={i} object={edge} />
      ))}
    </>
  );
}
