export default function FixedBackground({ imageUrl }) {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -1,
            }}
        />
    );
}


// import {useRef} from "react";
// import {useFrame, useThree} from "@react-three/fiber";
// import * as THREE from "three";
//
// function FixedBackground({ imageUrl }) {
//     const { camera } = useThree();
//     const texture = new THREE.TextureLoader().load(imageUrl);
//
//     const mesh = useRef();
//     useFrame(() => {
//         if (!mesh.current) return;
//         const distance = 5; // 카메라로부터 거리
//         const aspect = window.innerWidth / window.innerHeight;
//         const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance;
//         const width = height * aspect;
//
//         mesh.current.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(distance));
//         mesh.current.quaternion.copy(camera.quaternion);
//         mesh.current.scale.set(width, height, 1);
//     });
//
//     return (
//         <mesh ref={mesh}>
//             <planeGeometry args={[1, 1]} />
//             <meshBasicMaterial map={texture} depthTest={false} />
//         </mesh>
//     );
// }
