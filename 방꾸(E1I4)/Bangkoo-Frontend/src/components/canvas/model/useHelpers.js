// components/canvas/model/useHelpers.js
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useHelpers(scene, showHelper) {
  const [boxHelper, setBoxHelper] = useState(null);

  useEffect(() => {
    if (!showHelper || !scene) return;

    const helper = new THREE.BoxHelper(scene, 0x00ff00);
    helper.material.depthTest = false;
    helper.material.transparent = true;
    helper.material.opacity = 1.0;

    setBoxHelper(helper);

    return () => {
      helper.geometry.dispose();
      helper.material.dispose();
      setBoxHelper(null);
    };
  }, [scene, showHelper]);

  return boxHelper;
}
