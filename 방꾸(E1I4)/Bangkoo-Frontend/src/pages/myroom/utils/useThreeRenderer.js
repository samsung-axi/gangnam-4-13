// useThreeRenderer.js (Refactored Version)
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { useEffect, useRef } from "react";
import { BoxHelper } from 'three';
import { ACESFilmicToneMapping } from 'three/src/constants.js';
// import { sRGBEncoding } from 'three/src/constants.js';

export const useThreeRenderer = (canvasRef,options = {}) => {
    const getCenterArea = options.getCenterArea ?? (() => null);
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const modelRef = useRef();
    const controlsRef = useRef();
    const composerRef = useRef();
    const outlinePassRef = useRef();
    const isReady = useRef(false);
    const modelMap = useRef(new Map());  // ✅ GLB 모델 캐시
    const glbModelStateRef = useRef(new Map());
    const boundingBoxHelperRef = useRef(null);
    const initRenderer = () => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) {
            console.warn("❗ Canvas가 아직 준비되지 않음");
            return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        console.log("client height 값 :",height);
        canvas.width = width;
        canvas.height = height;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true});
        renderer.setSize(width,height);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2; // 밝기 조정 (기본 1.0 → 더 밝게)

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
        outlinePass.edgeStrength = 5.0;
        outlinePass.edgeGlow = 0.0;
        outlinePass.edgeThickness = 2.0;
        outlinePass.visibleEdgeColor.set("#ff0000");
        outlinePass.hiddenEdgeColor.set("#000000");
        composer.addPass(outlinePass);


        // const ambientLight = new THREE.AmbientLight(0xffffff, 3.7);
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        // directionalLight.position.set(5, 5, 5);
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);      // 전체 밝기 낮춤
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        // directionalLight.position.set(5, 10, 5);                          // 위쪽에서 비추는 느낌
        // directionalLight.castShadow = true;
        // Ambient 조명 – 실내 전체 밝기 (확산광)
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
        scene.add(ambientLight);

// DirectionalLight – 창문에서 들어오는 강한 햇빛
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(10, 10, -10); // 창 오른쪽 위에서 비추도록 위치 조정
        scene.add(directionalLight);

// Soft light – 창문 옆 조도용
        const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(fillLight);
        scene.add(ambientLight);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
        controls.update();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;
        composerRef.current = composer;
        outlinePassRef.current = outlinePass;
        isReady.current = true;

        animate();
    };

    const animate = () => {
        requestAnimationFrame(animate);
        controlsRef.current?.update();

        // ✅ WebGL 렌더링 마스크 영역 제한

        const region = getCenterArea(); // ⬅️ 외부에서 전달된 centerArea 사용
        if (region && rendererRef.current) {
            const { x, y, width, height } = region;
            rendererRef.current.setScissorTest(true);
            rendererRef.current.setScissor(x, y, width, height);
            // rendererRef.current.setViewport(x, y, width, height);
        }

        // ✅ 바운딩 박스 업데이트
        if (boundingBoxHelperRef.current && modelRef.current) {
            boundingBoxHelperRef.current.update(); // 💡 핵심
        }
        if (modelRef.current?.userData?.boxHelper) {
            modelRef.current.userData.boxHelper.update();  // ✅ 올바른 접근 방식
        }
        composerRef.current?.render();
    };

    const loadModel = (url) => {
        return new Promise((resolve, reject) => {
        if (modelMap.current.has(url)) {
            const model = modelMap.current.get(url);
            model.visible = true;
            sceneRef.current.add(model);   // 다시 보여줌
            modelRef.current = model;
            // outlinePassRef.current.selectedObjects = [model];
            focusModel();                  // 위치 재조정
            resolve(model);
            return;
        }
        if (!isReady.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) {
            console.warn("❗ Renderer 초기화가 완료되지 않아 loadModel 실행 불가");
            return;
        }

        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.userData.url = url; // ✅ 여기에 추가
            console.log("✅ 모델 로드 성공:", model);
            
            if (modelRef.current) {
                // sceneRef.current.remove(modelRef.current);
                modelRef.current.visible = false; // 🔥 제거 대신 숨기기
            }

            model.visible = true;
            model.position.set(0, 0, 0);

            const savedState = glbModelStateRef.current.get(url);

            if (savedState) {
                // 🔁 저장된 상태 있으면 그대로 복원
                model.position.copy(savedState.position);
                model.rotation.copy(savedState.rotation);
                model.scale.copy(savedState.scale);
                if (savedState.camera && savedState.controls) {
                    cameraRef.current.position.copy(savedState.camera);
                    controlsRef.current.target.copy(savedState.controls);
                    controlsRef.current.update();
                }

                modelMap.current.set(url, model);
                modelRef.current = model;
                sceneRef.current.add(model);
                // outlinePassRef.current.selectedObjects = [model];
                focusModel();
                resolve(model);
                return;
            }
            else {
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            if (size.length() < 0.001) {
                console.log("사이즈 작음 — 기본 스케일 적용");
                model.scale.setScalar(1);
            } else {
                const targetSize = 1.0;
                const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);
                model.scale.setScalar(scaleFactor);
                // ✅ Y축 중심으로 위치 보정 (중심을 화면 정중앙에 맞추기)
                const centerY = (box.max.y + box.min.y) / 2;
                model.position.y -= centerY * scaleFactor;

                // ✅ 카메라 포지션 보정 (Y값 너무 크면 위에서 내려다보는 느낌)
                if (cameraRef.current && controlsRef.current) {
                    const camera = cameraRef.current;
                    const controls = controlsRef.current;

                    const fov = camera.fov * (Math.PI / 180);
                    const distance = targetSize / (2 * Math.tan(fov / 2));

                    camera.position.set(center.x, center.y, center.z + distance * 1.5);  // ✔ Y 높이 제거!
                    camera.lookAt(center);
                    controls.target.copy(center); // 🔥 중심 제대로 따라가게
                    controls.update();
                }
                // model.position.y -= box.min.y * scaleFactor;
            }

            const fov = cameraRef.current.fov * (Math.PI / 180);
            const distance = 1.0 / (2 * Math.tan(fov / 2));
            cameraRef.current.position.set(center.x, center.y + 1, center.z + distance * 1.5);
            cameraRef.current.lookAt(center);
            controlsRef.current.target.copy(center);
            controlsRef.current.update();

            modelMap.current.set(url, model);     // 캐시에 저장
            modelRef.current = model;
            sceneRef.current.add(model);
            focusModel();
            resolve(model);
        }
        },
            (progress) => {
                // console.log("📦 로딩 중...", progress);
            },(error) => {
                console.error("❌ 모델 로딩 실패:", error);
                reject(error);
            }
            );
    });
    };
    const hideModel = (id) => {
        const model = modelMap.current.get(id);
        if (model) {
            model.visible = false;
        }
    };
    const focusModel = () => {
        if (!isReady.current || !modelRef.current || !cameraRef.current || !controlsRef.current) {
            console.warn("❗ 모델 또는 렌더러 구성요소가 초기화되지 않음");
            return;
        }

        const model = modelRef.current;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        // 🔍 모델 박스 정보 추출
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // ✅ 모델이 너무 작을 경우 대비
        const maxDim = Math.max(size.x, size.y, size.z);
        const safeDim = maxDim < 0.01 ? 1.0 : maxDim;

        const fov = camera.fov * (Math.PI / 180);
        const distance = safeDim / (2 * Math.tan(fov / 2)); // 시야각에 맞는 거리 계산

        // ✅ 카메라 위치 설정
        camera.position.set(center.x, center.y + 1, center.z + distance * 1.5);
        camera.lookAt(center);
        // camera.current.position.set(center.x, center.y + 1, center.z + distance * 1.5);
        // camera.current.lookAt(center);

        // ✅ 컨트롤 타겟도 중심으로 이동

        controls.target.copy(center);
        controls.update();

        console.log("🎯 카메라 포커싱 완료:", {
            center: center.toArray(),
            distance,
        });
    };


    const moveModel = (dx, dz) => {
        if (modelRef.current) {
            modelRef.current.position.x += dx;
            modelRef.current.position.z += dz;
            // ✅ boxHelper도 갱신
            const box = modelRef.current.userData.boxHelper;
            if (box) {
                box.update();
            }
        }
    };

    const zoom = (delta) => {
        if (cameraRef.current) {
            cameraRef.current.position.z += delta;
        }
    };
    const addBoundingBoxToModel = (model) => {
        // const boxHelper = new THREE.BoxHelper(model, 0xff0000); // 빨간 박스
        // boxHelper.name = 'boxHelper';
        // sceneRef.current.add(boxHelper);
        //
        // // 🔁 model.userData에 저장
        // model.userData.boxHelper = boxHelper;
        // return boxHelper; // ✅ return 꼭 해줘야함!

            // 기존 BoxHelper 제거
            if (model.userData.boxHelper) {
                sceneRef.current.remove(model.userData.boxHelper);
            }

            // ✅ 꼭 업데이트 후 생성할 것
            model.updateMatrixWorld(true);

            const boxHelper = new THREE.BoxHelper(model, 0xff0000); // 빨간 박스
            boxHelper.name = 'boxHelper';

            // ✅ 이거 꼭!
            boxHelper.update();

            // 씬에 추가
            sceneRef.current.add(boxHelper);

            // 모델에 저장
            model.userData.boxHelper = boxHelper;

            return boxHelper;


    };
    const getCurrentModel = () => {
        const modelMap = glbModelStateRef.current;
        for (const [_, state] of modelMap.entries()) {
            if (state.visible) return state.instance;
        }
        return null;
    };

    return {
        initRenderer,
        loadModel,
        moveModel,
        sceneRef,
        zoom,
        focusModel,
        getCurrentModel,
        sceneRef,
        glbModelStateRef,
        cameraRef,           // 👈 추가
        controlsRef,         // 👈 추가
        addBoundingBoxToModel,
        rendererRef,
    };
};
