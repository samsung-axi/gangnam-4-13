// // FurnitureEditorPage.js
// // 작성자: 김태원

// import React, { useState, useEffect, useRef, Suspense } from 'react';
// import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import FixedBackground from '../../common/three/FixedBackground';
// import BackgroundUploader from '../../common/three/BackgroundUploader';
// import * as THREE from 'three';

// function Model({ url, showMask }) {
//     const { scene } = useGLTF(url);
//     const { camera, controls } = useThree();
//     const [helperBox, setHelperBox] = useState(null);
//     const [edges, setEdges] = useState([]);

//     useEffect(() => {
//         const realWidth = 0.82;
//         const box = new THREE.Box3().setFromObject(scene);
//         const modelSize = new THREE.Vector3();
//         box.getSize(modelSize);

//         if (modelSize.x >= 5) {
//             const scaleX = realWidth / modelSize.x;
//             scene.scale.setScalar(scaleX);
//         }

//         placeModelOnGround(scene);

//         const newBox = new THREE.Box3().setFromObject(scene);
//         const newCenter = new THREE.Vector3();
//         newBox.getCenter(newCenter);

//         const helper = new THREE.BoxHelper(scene, 0xff0000);
//         scene.add(helper); // Attach directly to scene
//         setHelperBox(helper);

//         const maxSize = Math.max(...newBox.getSize(new THREE.Vector3()).toArray());
//         const fov = camera.fov * (Math.PI / 180);
//         const distance = maxSize / (2 * Math.tan(fov / 2));
//         camera.position.set(newCenter.x, newCenter.y, newCenter.z + distance * 1.5);
//         camera.lookAt(newCenter);

//         if (controls) {
//             controls.target.copy(newCenter);
//             controls.update();
//         }
//     }, [scene, camera, controls]);

//     useEffect(() => {
//         if (!showMask) {
//             setEdges([]);
//             return;
//         }

//         const newEdges = [];

//         scene.traverse((child) => {
//             if (child.isMesh) {
//                 const edgeGeo = new THREE.EdgesGeometry(child.geometry);
//                 const edgeMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
//                 const edge = new THREE.LineSegments(edgeGeo, edgeMat);
//                 edge.position.copy(child.position);
//                 edge.rotation.copy(child.rotation);
//                 edge.scale.copy(child.scale);
//                 newEdges.push(edge);
//             }
//         });

//         setEdges(newEdges);

//         return () => {
//             newEdges.forEach(e => {
//                 e.geometry.dispose();
//                 e.material.dispose();
//             });
//             setEdges([]);
//         };
//     }, [showMask, scene]);

//     return (
//         <>
//             <primitive object={scene} dispose={null} />
//             {showMask && edges.map((edge, idx) => <primitive object={edge} key={idx} />)}
//         </>
//     );
// }

// function Room() {
//     return <></>;
// }

// export default function FurnitureEditorPage() {
//     const [background, setBackground] = useState(null);
//     const [modelUrl, setModelUrl] = useState(null);
//     const [canvasSize, setCanvasSize] = useState({ width: 1024, height: 768 });
//     const [showMask, setShowMask] = useState(false);

//     const [modelList, setModelList] = useState([]);

//     const handleBackgroundLoad = (url) => {
//         const img = new Image();
//         img.onload = () => {
//             const width = img.naturalWidth;
//             const height = img.naturalHeight;
//             setCanvasSize({ width, height });
//             setBackground(url);
//         };
//         img.src = url;
//     };

//     const handleModelUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const url = URL.createObjectURL(file);
//             setModelUrl(url);
//         }
//     };

// const handleApply = async () => {
//     setShowMask(true);
//     await new Promise(resolve => setTimeout(resolve, 200));

//     const canvas3D = document.querySelector('canvas');
//     const bgImg = new Image();
//     bgImg.src = background;

//     const fgImg = new Image();
//     fgImg.src = canvas3D.toDataURL('image/png');

//     await Promise.all([
//         new Promise(resolve => bgImg.onload = resolve),
//         new Promise(resolve => fgImg.onload = resolve),
//     ]);

//     const finalCanvas = document.createElement('canvas');
//     finalCanvas.width = canvasSize.width;
//     finalCanvas.height = canvasSize.height;
//     const ctx = finalCanvas.getContext('2d');

//     ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);
//     ctx.drawImage(fgImg, 0, 0, finalCanvas.width, finalCanvas.height);

//     // ⭐ 1. 이미지 미리보기 (팝업)
//     const result = finalCanvas.toDataURL('image/png');
//     const win = window.open();
//     if (win) {
//         win.document.write(`<img src="${result}" style="max-width:100%;" />`);
//     } else {
//         alert("팝업이 차단되어 이미지 미리보기를 열 수 없습니다.");
//     }

//     // ⭐ 2. AI 서버로 전송
//     finalCanvas.toBlob(async (blob) => {
//         const formData = new FormData();
//         formData.append('background', blob, 'bg.png');

//         const modelName = modelUrl?.split('/')?.pop() || 'unknown_model.glb';
// //        formData.append('modelName', modelName);

//         try {
//             const response = await fetch('http://localhost:8080/api/placement?mode=add', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) throw new Error('Server Error');

//             const base64 = await response.text();
//             const win = window.open();
//             if (win) {
//                 win.document.write(`<img src="data:image/png;base64,${base64}" style="max-width:100%;" />`);
//             } else {
//                 alert("팝업이 차단돼서 미리보기를 볼 수 없음!");
//             }
//             console.log('AI Result:', result);
//             alert('AI 배치 요청 성공!');

//         } catch (err) {
//             console.error('AI 서버 전송 실패:', err);
//             alert('AI 서버로 전송 중 오류 발생!');
//         }
//     }, 'image/png');

//     setShowMask(false);
// };


//     return (
//         <>
//             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//                 <BackgroundUploader onUpload={handleBackgroundLoad} />
//                 <label style={{ background: '#eee', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
//                     모델 업로드
//                     <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} style={{ display: 'none' }} />
//                 </label>
//             </div>

//             <div
//                 style={{
//                     width: `${canvasSize.width}px`,
//                     height: `${canvasSize.height}px`,
//                     position: 'relative',
//                     margin: '0 auto',
//                     overflow: 'hidden',
//                 }}
//             >
//                 {background && (
//                     <FixedBackground
//                         imageUrl={background}
//                         style={{
//                             objectFit: 'cover',
//                             width: `${canvasSize.width}px`,
//                             height: `${canvasSize.height}px`,
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             zIndex: 0,
//                         }}
//                     />
//                 )}

//                 <Canvas
//                     camera={{ position: [0, 1.2, 4], fov: 45 }}
//                     gl={{ preserveDrawingBuffer: true, alpha: true }}
//                     style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: `${canvasSize.width}px`,
//                         height: `${canvasSize.height}px`,
//                         zIndex: 1,
//                         pointerEvents: 'auto',
//                     }}
//                 >
//                     <ambientLight intensity={0.5} />
//                     <directionalLight position={[5, 5, 5]} intensity={0.8} />
//                     <Suspense fallback={null}>
//                         <Room />
//                         {modelUrl && <Model url={modelUrl} showMask={showMask} />}
//                     </Suspense>
//                     <OrbitControls />
//                 </Canvas>
//             </div>

//             <div style={{ textAlign: 'center', marginTop: '20px' }}>
//                 <button
//                     onClick={handleApply}
//                     style={{
//                         background: '#ffda44',
//                         border: 'none',
//                         padding: '10px 16px',
//                         borderRadius: '8px',
//                         fontWeight: 'bold',
//                         cursor: 'pointer',
//                     }}
//                 >
//                     적용하기
//                 </button>
//             </div>
//         </>
//     );
// }

// function placeModelAtPosition(scene, targetPosition) {
//     const box = new THREE.Box3().setFromObject(scene);
//     const center = new THREE.Vector3();
//     box.getCenter(center);
//     const offset = new THREE.Vector3().subVectors(targetPosition, center);
//     scene.position.add(offset);
// }

// function placeModelOnGround(scene) {
//     const box = new THREE.Box3().setFromObject(scene);
//     const yOffset = box.min.y;
//     scene.position.y -= yOffset;
// }
