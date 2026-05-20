// components/canvas/model/useModelTransform.js
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { placeModelOnGround } from './placeModelOnGround';

export function useModelTransform(scene) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!scene) return;

    const realWidth = 0.82;
    const box = new THREE.Box3().setFromObject(scene);
    const modelSize = new THREE.Vector3();
    box.getSize(modelSize);

    if (modelSize.x >= 5) {
      const scaleX = realWidth / modelSize.x;
      scene.scale.setScalar(scaleX);
    }

    placeModelOnGround(scene);

    const newBox = new THREE.Box3().setFromObject(scene);
    const newCenter = new THREE.Vector3();
    newBox.getCenter(newCenter);

    const maxSize = Math.max(...newBox.getSize(new THREE.Vector3()).toArray());
    const fov = camera.fov * (Math.PI / 180);
    const distance = maxSize / (2 * Math.tan(fov / 2));
    camera.position.set(newCenter.x, newCenter.y, newCenter.z + distance * 1.5);
    camera.lookAt(newCenter);

    if (controls) {
      controls.target.copy(newCenter);
      controls.update();
    }
  }, [scene, camera, controls]);
}