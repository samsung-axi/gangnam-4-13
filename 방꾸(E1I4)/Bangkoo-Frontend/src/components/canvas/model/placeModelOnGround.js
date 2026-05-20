// components/canvas/model/placeModelOnGround.js

import * as THREE from 'three';

export function placeModelOnGround(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const yOffset = box.min.y;
  scene.position.y -= yOffset;
}
