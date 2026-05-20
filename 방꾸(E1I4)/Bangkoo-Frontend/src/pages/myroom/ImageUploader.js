import React, { useImperativeHandle, forwardRef, useRef, useState , useEffect } from "react";
import { ReactComponent as ImageUploaderIcon } from "@/assets/images/ImageUploaderIcon.svg";
import {Text} from "@/common/Typography";
import { useDispatch,useSelector } from "react-redux";
import { setInitialFurniture } from "@/features/furniture/furnitureSlice";
import {
    BlurredCanvas, BlurredWrapper, MaskCanvas,
    DeleteBox, MainCanvas,
    UploadBox,
    UploadContainer,
    UploadInput, UndoRedoBox, LoadingBox
} from "./css/ImageUploader.styled";
import CommonButton from "@/common/CommonButton";
import ImageRenderer from "./ImageRenderer";
import axios from "axios";
import { usePlacementHistory } from "@/hooks/usePlacementHistory";
import { useApplyPlacement } from "@/hooks/useApplyPlacement";
import {FaUndo, FaRedo} from "react-icons/fa";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThreeRenderer } from "./utils/useThreeRenderer";
import { recommendFromImage } from "../../api/Recomendation/recommend";

import LoadingSpinner from "../../common/LoadingSpinner";
import { current } from "@reduxjs/toolkit";
import ThumbnailControls from "@/components/ThumbnailControls";

const ImageUploader = forwardRef((props, ref) => {
        const {
            canvasRef,
            onImageUploaded,
            onObjectSelect,
            selectedIndex,
            setselectedIndex,
            resetObjectPositionRef,
            setCenterArea,
            mode, 
            setMode,
            className,
            setIsImageUploaded,
           onRedisKey,
            sessionIdRef,
        } = props;
    
    const [imageUrl, setImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    // const canvasRef = useRef(null);
    const bgImageRef = useRef(null);
    const dispatch = useDispatch();
    const containerRef = useRef();
    const restoreInitialImageRef = useRef();
    const originalImageRef = useRef(null);
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [thumbnailScale, setThumbnailScale] = useState(1);
    const [thumbnailRotation, setThumbnailRotation] = useState(0);
    const [thumbnailPos, setThumbnailPos] = useState({ x: 500, y: 500 });
    const thumbnailControlRef = useRef();
    const currentScale = thumbnailControlRef.current?.getScale?.() || 1;
    const currentRotation = thumbnailControlRef.current?.getRotation?.() || 0;

    const { currentImage, saveState, undo, redo, clearHistory } = usePlacementHistory(sessionIdRef);
    const [isFirstUpload, setIsFirstUpload] = useState(true);
    const furnitureList = useSelector((state) => state.furniture.list);
    // 히스토리용 currentImage가 바뀌면 imageBase64도 덮어써서
    // [imageBase64] useEffect 를 다시 트리거하도록 함
    useEffect(() => {
      if (currentImage !== null) {
        setImageBase64(currentImage);
      }
    }, [currentImage]);    

    const webglCanvasRef = useRef(null); // 3D Canvas
    const { initRenderer,loadModel,moveModel, zoom, focusModel, getCurrentModel,  sceneRef,rendererRef, glbModelStateRef, cameraRef, controlsRef,addBoundingBoxToModel  } = useThreeRenderer(webglCanvasRef,{getCenterArea:() => transformRef.current?.centerArea}); // 💡 초기화
    const transformRef = useRef(null); // 🔥 transform 기억해둠
    const is3DDragging = useRef(false);
    const last3DMouse = useRef({ x: 0, y: 0 });
    const [rendererInitialized , setRendererInitialized] = useState(false);
    const modelMap = useRef(new Map());           // 캐시된 모델
    const modelRef = useRef(null);                // 현재 보이는 모델

    const [isUploading, setIsUploading] = useState(false); // 업로드 상태 관리
    const [loadingDots, setLoadingDots] = useState("");

    const [draggingThumbnailPos, setDraggingThumbnailPos] = useState(null);
    const [finalThumbnailPos, setFinalThumbnailPos] = useState(null);
    const [clickOffsetRatio, setClickOffsetRatio] = useState({ x: 0.5, y: 0.5 });
    const [initialDragBbox, setInitialDragBbox] = useState(null);
    const [finalImagePos, setFinalImagePos] = useState(null);
    
    useEffect(() => {
        if (!isUploading) return;
        const interval = setInterval(() => {
            setLoadingDots(prev => prev === "..." ? "" : prev + ".");
        }, 500);
        return () => clearInterval(interval);
    }, [isUploading]);

      const drawScene = (objects = detectedObjects) => {
        if (!canvasRef.current || !bgImageRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
        const transform = transformRef.current;
        if (!transform) {
          console.warn("❌ transform이 비어 있음!");
          return;
        }
      
        drawImageContainWithSideBlur(bgImageRef.current, ctx, canvasRef.current, transform);
       
        // 🔸 마스크 윤곽선은 항상 original 위치 기준으로 그리기
        if (typeof selectedIndex === "number" && objects[selectedIndex]) {
          const obj = objects[selectedIndex];
          const maskTarget = mode === "move" && initialDragBbox
            ? { ...obj, bbox: initialDragBbox }  // 이동 중엔 원래 bbox로
            : obj;
          drawMaskBorder(ctx, maskTarget, transform);
        }
      };
      
        
    const drawImageContainWithSideBlur = (image, ctx, canvas,reuseTransform = null) => {
        let transform;
        if (reuseTransform) {
            const { scaleX, scaleY, offsetX, offsetY, centerArea } = reuseTransform;
            const renderableWidth = image.width * scaleX;
            const renderableHeight = image.height * scaleY;

            const blurWidth = offsetX;

            // 좌우 블러 처리 (🔥 추가해야 blur가 보임)
            if (blurWidth > 0) {
                ctx.filter = "blur(15px)";
                ctx.drawImage(
                    image,
                    0, 0, image.width * 0.05, image.height,
                    0, offsetY, blurWidth, renderableHeight
                );
                ctx.drawImage(
                    image,
                    image.width * 0.95, 0, image.width * 0.05, image.height,
                    offsetX + renderableWidth, offsetY, blurWidth, renderableHeight
                );
            }

            // 중앙 영역
            ctx.filter = "none";
            ctx.drawImage(image, offsetX, offsetY, renderableWidth, renderableHeight);
            return reuseTransform;
        }
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = image.width / image.height;

        let renderableWidth, renderableHeight, xStart, yStart;

        if (imageAspect > canvasAspect) {
            renderableWidth = canvas.width;
            renderableHeight = renderableWidth / imageAspect;
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        } else {
            renderableHeight = canvas.height;
            renderableWidth = renderableHeight * imageAspect;
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        }
        const blurWidth = xStart;
        // ✅ 1. 좌우 블러 처리
        if (blurWidth > 0) {
            ctx.filter = "blur(15px)";
            ctx.drawImage(image, 0, 0, image.width * 0.05, image.height, 0, yStart, blurWidth, renderableHeight);
            ctx.drawImage(image, image.width * 0.95, 0, image.width * 0.05, image.height, xStart + renderableWidth, yStart, blurWidth, renderableHeight);
        }

        ctx.filter = "none";
        ctx.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);

        transform = {
            scaleX: renderableWidth / image.width,
            scaleY: renderableHeight / image.height,
            offsetX: xStart,
            offsetY: yStart,
            centerArea: {
                x: xStart,
                y: yStart,
                width: renderableWidth,
                height: renderableHeight
            },
        };

        if (setCenterArea) setCenterArea(transform.centerArea);
        return transform;
    };

        const drawMaskOnly = () => {
            if (!canvasRef.current || !bgImageRef.current || !transformRef.current) {
                console.warn("❗ 필수 요소 없음: canvas or image or transform");
                return;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const transform = transformRef.current;

            // 1. 최신 배경 이미지 유지
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawImageContainWithSideBlur(bgImageRef.current, ctx, canvas, transform);

            // 2. 선택된 마스크만 덧그리기
            if (typeof selectedIndex === "number" && detectedObjects[selectedIndex]?.bbox) {
                drawMaskBorder(ctx, detectedObjects[selectedIndex], transform);
            }
        };
    const handle3DMouseDown = (e) => {
        setMode("add");
        is3DDragging.current = true;
        last3DMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handle3DMouseMove = (e) => {
        if (!is3DDragging.current) return;

        const dx = (e.clientX - last3DMouse.current.x) * 0.01;
        const dy = (e.clientY - last3DMouse.current.y) * 0.01;
        last3DMouse.current = { x: e.clientX, y: e.clientY };

        moveModel(dx, dy); // useThreeRenderer에서 가져온 함수
    };

    const handle3DMouseUp = () => {
        is3DDragging.current = false;
        const model = modelRef.current; // 현재 선택된 3D 모델
        if (model && ref.current) {
            const refImage = model.userData?.referenceImage;
            if (refImage) {
                ref.current.reference = refImage;
                // console.log("✅ 3D 드래그 후 reference 자동 세팅 완료:", refImage);
            } else {
                console.warn("⚠️ 모델에 referenceImage가 없습니다.");
            }
        }
    };
    useEffect(() => {
        if (resetObjectPositionRef) {
            resetObjectPositionRef.current = (index) => {
                setDetectedObjects((prev) => {
                    const updated = [...prev];
                    const obj = updated[index];
                    if (!obj || !obj.originalBbox) return prev;

                    updated[index] = {
                        ...obj,
                        bbox: [...obj.originalBbox],
                    };

                    return updated;
                });

                // ❗여기서 selectedIndex도 설정해줘야 drawScene 반응함
                setselectedIndex(index); 
                const obj = detectedObjects[index];
                if (obj && transformRef.current) {
                  const transform = transformRef.current;
                  const [bx, by, bw, bh] = obj.bbox;
              
                  const canvasX = bx * transform.scaleX + transform.offsetX;
                  const canvasY = by * transform.scaleY + transform.offsetY;
                  const width   = bw * transform.scaleX;
                  const height  = bh * transform.scaleY;
              
                  const centerX = canvasX + width * 0.5;
                  const centerY = canvasY + height * 0.5;
              
                  setFinalThumbnailPos({ x: centerX, y: centerY });
                  setClickOffsetRatio({ x: 0.5, y: 0.5 });
                }
            };
        }
    }, [resetObjectPositionRef]);
    
    const handleGlbClick = (url, id) => {
        setMode("add");
        if (!rendererInitialized) {
            initRenderer();
            setRendererInitialized(true);
        }

        if (webglCanvasRef.current) {
            webglCanvasRef.current.style.pointerEvents = "auto";
            webglCanvasRef.current.style.visibility = "visible";
        }

        const modelMap = glbModelStateRef.current;
        const currentModel = getCurrentModel();

        // ✅ 같은 모델을 다시 클릭한 경우 → 숨김 처리
        if (currentModel && currentModel.userData?.url === url && currentModel.visible) {
           
            sceneRef.current.remove(currentModel);
            currentModel.visible = false;

            const state = modelMap.get(url);
            const box = currentModel.userData.boxHelper;
            if (box) {
                sceneRef.current.remove(box);       // ✅ 박스 제거
                box.geometry.dispose();             // 메모리 해제 (선택)
                box.material.dispose();
                currentModel.userData.boxHelper = null;
            }

            modelMap.set(url, {
                ...state,
                visible: false,
                position: currentModel.position.clone(),
                rotation: currentModel.rotation.clone(),
                scale: currentModel.scale.clone(),
                cameraPosition: cameraRef.current.position.clone(),
                cameraTarget: controlsRef.current.target.clone(),
                instance: currentModel,
                boxHelper: null
                // boxHelper: state?.boxHelper
            });
            if (webglCanvasRef.current) {
                webglCanvasRef.current.style.pointerEvents = "none";
                webglCanvasRef.current.style.visibility = "hidden";
            }
            return;
        }
        // 🔁 현재 보이는 모델 모두 숨김
        for (const [modelUrl, state] of modelMap.entries()) {
            if (state.visible && state.instance) {
                console.log("👻 기존 모델 숨김:", modelUrl);

                sceneRef.current.remove(state.instance);
                state.instance.visible = false;

                const box = currentModel.userData.boxHelper;
                if (box) {
                    sceneRef.current.remove(box);       // ✅ 박스 제거
                    box.geometry.dispose();             // 메모리 해제 (선택)
                    box.material.dispose();
                    currentModel.userData.boxHelper = null;
                }

                // 상태 저장 + 카메라 위치도 함께 저장
                modelMap.set(modelUrl, {
                    ...state,
                    visible: false,
                    position: state.instance.position.clone(),
                    rotation: state.instance.rotation.clone(),
                    scale: state.instance.scale.clone(),
                    cameraPosition: cameraRef.current.position.clone(),
                    cameraTarget: controlsRef.current.target.clone(),
                    instance: state.instance,
                    boxHelper: null
                    // boxHelper: state.boxHelper  // ✅ 박스 헬퍼 함께 저장
                });
            }
        }

        // 🔄 복원 처리 (모델이 이미 존재하지만 숨김 상태일 경우)
        if (modelMap.has(url) && !modelMap.get(url).visible) {
            const state = modelMap.get(url);
            const model = state.instance;

            model.visible = true;
            model.position.copy(state.position);
            model.rotation.copy(state.rotation);
            model.scale.copy(state.scale);
            model.userData.url = url;
            modelRef.current = model;
            sceneRef.current.add(model);
            // ✅ 박스도 함께 복원
            const box = model.userData.boxHelper;
            if (!model.userData.boxHelper) {
                const newBox = addBoundingBoxToModel(model);
                model.userData.boxHelper = newBox;
            } else {
                // ✅ 박스가 있다면 씬에 다시 추가
                sceneRef.current.add(model.userData.boxHelper);
                model.userData.boxHelper.visible = true;
            }
            // 🔁 카메라 복원
            if (state.cameraPosition && state.cameraTarget) {
                cameraRef.current.position.copy(state.cameraPosition);
                controlsRef.current.target.copy(state.cameraTarget);
                controlsRef.current.update();
            }

            modelMap.set(url, { ...state, visible: true});
            return;
        }

        // 📦 새로 로드
        
        loadModel(url)
            .then((model) => {
                model.userData.url = url;

                const saved = modelMap.get(url);
                if (saved) {
                    model.position.copy(saved.position);
                    model.rotation.copy(saved.rotation);
                    model.scale.copy(saved.scale);
                }

                model.visible = true;
                const boxHelper = addBoundingBoxToModel(model);
                modelRef.current = model;

                sceneRef.current.add(model);

                // 카메라 저장용 포커싱 후 상태 저장
                focusModel();

                modelMap.set(url, {
                    visible: true,
                    position: model.position.clone(),
                    rotation: model.rotation.clone(),
                    scale: model.scale.clone(),
                    cameraPosition: cameraRef.current.position.clone(),
                    cameraTarget: controlsRef.current.target.clone(),
                    instance: model,
                    boxHelper: boxHelper  // ✅ 박스 헬퍼 함께 저장
                });
            })
            .catch((err) => {
                console.error("❌ 모델 로딩 실패:", err);
            });
    };







    const handleUndo = async () => {
        const base64 = await undo(); // ⬅️ 훅에서 base64 받아옴
        if (!base64 || !canvasRef.current) return;
      
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height);
      
          bgImageRef.current = image;
          const transform = drawImageContainWithSideBlur(image, ctx, canvas);
          transformRef.current = transform;
          setImageBase64(base64); // 마스크 재렌더링 위해 base64도 갱신
          
          setDraggingThumbnailPos(null);
          setFinalThumbnailPos(null);
          setClickOffsetRatio({ x: 0.5, y: 0.5 });
          setInitialDragBbox(null);
        };
        image.src = base64;
      };
      
      const handleRedo = async () => {
        const base64 = await redo();
        if (!base64 || !canvasRef.current) return;
      
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height);
      
          bgImageRef.current = image;
          setImageBase64(base64);

          setDraggingThumbnailPos(null);
          setFinalThumbnailPos(null);
          setClickOffsetRatio({ x: 0.5, y: 0.5 });
          setInitialDragBbox(null);
        };
        image.src = base64;
    };
            const restoreOriginalImage = () => {
                if (!originalImageRef.current || !canvasRef.current) {
                console.warn("❗ 원본 이미지나 캔버스 없음");
                return;
                }
            
                const image = new Image();
                image.onload = () => {
                const ctx = canvasRef.current.getContext("2d");
                canvasRef.current.width = image.width;
                canvasRef.current.height = image.height;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(image, 0, 0);
                bgImageRef.current = image;
                setImageBase64(originalImageRef.current); // base64도 갱신
                };
                image.src = originalImageRef.current;
            };

            useEffect(() => {
                if (restoreInitialImageRef) {
                    restoreInitialImageRef.current = restoreOriginalImage;
                } else {
                    console.warn("restoreInitialImageRef가 비어있음.")
                }
            }, [restoreInitialImageRef]);

            useImperativeHandle(ref, () => ({
                handleFileChange,
                setFinalThumbnailPos,
                setDraggingThumbnailPos,
                setImageBase64: (base64) => {
                    setImageBase64(base64);
                  },
                  setBgImage: (img) => {
                    bgImageRef.current = img;
                  },
                setOriginalBackground: (img) => {
                    originalImageRef.current = img;
                },  
                getOriginalBackground: () => {
                    return originalImageRef.current;
                  },
                loadGlbModel: (url) => {
                    handleGlbClick(url);
                },
                updatedTransform: (newTransform) => {
                    transformRef.current = newTransform;
                },
                updateCanvasSize: (size) => {
                    setImageWidth(size.width);
                    setImageHeight(size.height);
                },
                focusModel: focusModel,
                updateTransformFromImage: () => {
                    if (!canvasRef.current || !bgImageRef.current) return;
                  
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                  
                    // ✅ 강제 캔버스 리사이즈 (정상적인 크기 보장)
                    canvas.width = containerRef.current?.clientWidth || 1024;
                    canvas.height = containerRef.current?.clientHeight || 720;
                  
                    const transform = drawImageContainWithSideBlur(bgImageRef.current, ctx, canvas);
                    transformRef.current = transform;
                  },
                getCanvasMaskRegion: () => {
                    if (!transformRef.current) return null;
                    const { offsetX, offsetY, centerArea } = transformRef.current;
                    return {
                        x: offsetX,
                        y: offsetY,
                        width: centerArea.width,
                        height: centerArea.height,
                    };
                },
                finalThumbnailPos,
                clickOffsetRatio,
                thumbnailScale,
                thumbnailRotation,
                setThumbnailScale,
                setThumbnailRotation,
                transform: transformRef.current,
                thumbnail: detectedObjects?.[selectedIndex]?.thumbnail ?? null,
                bbox: detectedObjects[selectedIndex]?.bbox,
                outputSize: (() => {
                const canvas = canvasRef.current;
                if (!canvas) return { width: 0, height: 0 };
                return {
                    width: canvas.width || canvas.getBoundingClientRect().width,
                    height: canvas.height || canvas.getBoundingClientRect().height,
                };
                })(),
                restoreOriginalImage,
                thumbnailControlRef,
                merge3DWithCanvas: async () => {
                    const canvas2d = canvasRef.current;
                    const canvas3d = webglCanvasRef.current;
                  
                    if (!canvas2d || !canvas3d) throw new Error("캔버스가 없습니다");
                    const transform = transformRef.current;
                    if (!transform || !transform.centerArea) {
                      throw new Error("CenterArea 정보가 없습니다!");
                    }
                    
                    canvas3d.width = canvas2d.width;
                    canvas3d.height = canvas2d.height;

                    if (rendererRef.current) {
                        rendererRef.current.setSize(canvas2d.width, canvas2d.height);
                      }

                    const { x, y, width, height } = transform.centerArea;
                  
                    const renderer = rendererRef.current;
                    const scene = sceneRef.current;
                    const camera = cameraRef.current;
                  
                    // 💥 강제 렌더링
                    await new Promise((resolve) => requestAnimationFrame(resolve));
                    renderer.render(scene, camera);
                  
                    // 🔧 캔버스 병합용
                    const merged = document.createElement("canvas");
                    merged.width = width;
                    merged.height = height;
                    const ctx = merged.getContext("2d");
                  
                    // 🔄 canvas2D → centerArea만 crop
                    ctx.drawImage(
                      canvas2d,
                      x, y, width, height,   // src
                      0, 0, width, height    // dst
                    );
                  
                    // 🔄 canvas3D → centerArea만 crop
                    ctx.drawImage(
                      canvas3d,
                      0, 0, canvas3d.width, canvas3d.height,
                      0, 0, width, height
                    );
                  
                    return new Promise((resolve, reject) => {
                      merged.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Blob 생성 실패"));
                      }, "image/png", 1.0);
                    });
                  },
                  
                      reference: null,
                  clearSelectedIndex: () => {
                    if (typeof setselectedIndex === 'function') {
                        setselectedIndex(null);
                    }
                  }
            }));
    const applyAiImage = (aiBase64) => {
        setImageBase64(aiBase64);

        const image = new Image();
        image.onload = () => {
            bgImageRef.current = image;
            ref.current?.setOriginalBackground(image);
            const transform = drawImageContainWithSideBlur(image, canvasRef.current.getContext("2d"), canvasRef.current);
            transformRef.current = transform;
            drawScene(); // 선택된 객체에 대해 마스크만 다시 그림
        };
        image.src = aiBase64;
    };

    const handleFileChange = async (e) => {
        // const file = e.target.files[0];
        const file = e.target?.files?.[0] || e; // e가 File이면 직접 사용
        if (!file || !containerRef.current) return;

        // 업로드 시작 시 Spinner 표시
        setIsUploading(true);

    if (setIsImageUploaded) {
        setIsImageUploaded(true);
    }

    if(typeof onImageUploaded === "function"){
        onImageUploaded(file);
    }

            // 1) 세션 ID가 없으면 제일 먼저 생성
            if (!sessionIdRef.current) {
                sessionIdRef.current = crypto.randomUUID();
            }
    
            // 2) 기존 히스토리 초기화 (await 반드시!)
            await clearHistory();
        
        // ✅ 현재 div의 실제 보이는 크기 가져오기
        const divWidth = containerRef.current.clientWidth;
        const divHeight = containerRef.current.clientHeight;
        // console.log("📏 div 영역:", divWidth, divHeight);

    // ✅ 원본 이미지 크기 추출
    const imageBitmap = await createImageBitmap(file);
    const originalWidth = imageBitmap.width;
    const originalHeight = imageBitmap.height;

    setImageUrl(file);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file); // ⬅️ 원본 그대로 전송
    formData.append("canvasWidth", originalWidth);   // ⬅️ 원본 해상도 사용
    formData.append("canvasHeight", originalHeight); // ⬅️ 원본 해상도 사용

 

    console.log("현재 백엔드에서 보내는 file:",file);

    const formDataRecommend = new FormData();
    formDataRecommend.append("file",file);
    console.log("AI서버로 보낼 데이터:",formDataRecommend);

    try {
     // 두 개의 요청을 병렬로 보내기 위해 Promise.all 사용
     console.group("📡 [detect_all_base64 요청 및 응답]");
     console.log("요청 전송: /api/detect_all_base64");
     const resDetect = await axios.post("http://localhost:8080/api/detect_all_base64", formData);
     console.log("응답:", resDetect);
     console.groupEnd();

     console.group("📡 [recommend/from_image 요청 및 응답]");
     const recommendResult = await recommendFromImage(formDataRecommend);
     console.log("추천 응답:", recommendResult);
     console.groupEnd();


        // 첫 번째 요청 응답 처리 (detect_all_base64)
        originalImageRef.current = resDetect.data.original_image_base64;
        if (restoreInitialImageRef) {
            restoreInitialImageRef.current = restoreOriginalImage;
          }
        
        // rediskey를 부모컴포넌트로 전달
        // const key = recommendResult.data.redisKey; 
        const key = recommendResult.redisKey;
        if(typeof onRedisKey === "function"){
            onRedisKey(key);
        }

        const results = resDetect.data.results.map((obj, idx) => ({
            ...obj,
            x: obj.bbox?.[0],
            y: obj.bbox?.[1],
            width: obj.bbox?.[2],
            height: obj.bbox?.[3],
            bbox: obj.bbox,
            originalBbox: [...obj.bbox], // ✅ 초기 위치 보존
            mask: obj.mask,
            thumbIndex: idx,
            thumbnail: resDetect.data.thumbnails_base64[idx],
            flipHorizontal: false,
        }));

        // 결과에서 중복 항목을 필터링 (선택적으로 적용)
        const filtered = smartFilterDuplicates(results, 0.5);
        filtered.sort((a, b) => a.thumbIndex - b.thumbIndex);

        // 두 번째 요청 응답 처리 (recommend/from-image)
        const recommendedProducts = recommendResult.data; // 추천된 가구 리스트

        console.log("추천된 제품:", recommendedProducts);
        console.log("분석된 결과:", filtered);

        // 이후 작업 (예: 상태 업데이트 등)
        setDetectedObjects(filtered);
        setImageBase64(resDetect.data.original_image_base64);

                const img = new Image();
                img.onload = () => {
                    // 이미지 업로드 완료 후 상태 업데이트
                    setIsUploading(false); // 업로드 완료되면 Spinner 숨기기
                };
                img.src = resDetect.data.original_image_base64; // base64로 trigger

                // 3) 첫번째 상태 저장
                
                await saveState(resDetect.data.original_image_base64);
                
                originalImageRef.current = resDetect.data.original_image_base64;

                if (isFirstUpload) {
                    dispatch(setInitialFurniture(
                        filtered.map((item, index) => ({
                            id: Date.now() + index,
                            image: item.thumbnail,
                            type: "eyeOn",
                            isCustom: true,
                            bbox: item.bbox,
                            originalBbox: [...item.bbox],
                            mask: item.mask,
                        }))
                    ));
                    setIsFirstUpload(false);
                }
            } catch (error) {
                console.error("자동 업로드 또는 탐지 실패:", error);
                alert("업로드 또는 탐지 중 오류가 발생했습니다.");
                setIsUploading(false); // 업로드 실패 시에도 Spinner 숨기기
        }
    };
    
    const drawMaskBorder = (ctx, obj, transform = {
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0
      }) => {
        const [x, y, w, h] = obj.bbox;
        const mask = obj.mask;
        if (!mask || mask.length === 0 || mask[0].length === 0) return;
      
        const rows = mask.length;
        const cols = mask[0].length;
        const dx = w / cols;
        const dy = h / rows;
      
        const { scaleX, scaleY, offsetX, offsetY } = transform;
      
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      
        const isBorder = (j, i) => {
          if (!mask[j][i]) return false;
          const up = j > 0 ? mask[j - 1][i] : false;
          const down = j < rows - 1 ? mask[j + 1][i] : false;
          const left = i > 0 ? mask[j][i - 1] : false;
          const right = i < cols - 1 ? mask[j][i + 1] : false;
          return !(up && down && left && right);
        };
      
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            if (!isBorder(j, i)) continue;
      
            const px = x + i * dx;
            const py = y + j * dy;
      
            const canvasX = px * scaleX + offsetX;
            const canvasY = py * scaleY + offsetY;
            const canvasDX = dx * scaleX;
            const canvasDY = dy * scaleY;
      
            // ✅ 빠르고 간결하게 셀 채우기
            ctx.fillRect(canvasX, canvasY, canvasDX, canvasDY);
      
            // ✅ 테두리도 얇게
            ctx.strokeRect(canvasX, canvasY, canvasDX, canvasDY);
          }
        }
      };
      

    
    useEffect(() => {
        if (imageBase64) drawScene();
    }, [imageBase64,selectedIndex, imageWidth, imageHeight]);

    const isPointInsideBox = (x, y, bbox,transform) => {
        const [bx, by, bw, bh] = bbox;
        const { scaleX, scaleY, offsetX, offsetY } = transform;

        const canvasX = bx * scaleX + offsetX;
        const canvasY = by * scaleY + offsetY;
        const canvasW = bw * scaleX;
        const canvasH = bh * scaleY;

        return x >= canvasX && x <= canvasX + canvasW && y >= canvasY && y <= canvasY + canvasH;
        // const [bx, by, bw, bh] = bbox;
        //
        // return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    };

    useEffect(() => {
        if (!imageBase64 || !canvasRef.current || !containerRef.current) return;
      
        const image = new Image();
        image.onload = () => {
          const canvas = canvasRef.current;
          const container = containerRef.current;
          const width = container.clientWidth || 1024;
          const height = container.clientHeight || 720;
      
          canvas.width = width;
          canvas.height = height;

          if (webglCanvasRef.current) {
            webglCanvasRef.current.width = canvas.width;
            webglCanvasRef.current.height = canvas.height;
          }
        
          const ctx = canvas.getContext("2d");
          const transform = drawImageContainWithSideBlur(image, ctx, canvas);
          transformRef.current = transform;
      
          if (rendererRef.current) {
            rendererRef.current.setSize(canvas.width, canvas.height);
          }

          setImageWidth(image.width);
          setImageHeight(image.height);
          bgImageRef.current = image;
      
          drawScene();
        };
        image.src = imageBase64;
      }, [imageBase64]);

    const handleMouseDown = (e) => {
        if (!canvasRef.current) {
          console.warn("⛔ canvasRef.current is null!");
          return;
        }
      
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
      
        const transform = transformRef.current;
        if (!transform) return;
      
        if (typeof selectedIndex !== "number" || selectedIndex < 0) {
          console.warn("❗ selectedIndex가 유효하지 않음:", selectedIndex);
          return;
        }
      
        const obj = detectedObjects[selectedIndex];
        if (!obj || obj.isGlb || !obj.bbox) {
            console.warn("❗ 선택된 객체는 bbox 정보가 없거나 3D 모델입니다.");
            return;
        }
        const canvasX = obj.bbox[0] * transform.scaleX + transform.offsetX;
        const canvasY = obj.bbox[1] * transform.scaleY + transform.offsetY;
        const canvasW = obj.bbox[2] * transform.scaleX;
        const canvasH = obj.bbox[3] * transform.scaleY;
      
        if (x >= canvasX && x <= canvasX + canvasW && y >= canvasY && y <= canvasY + canvasH) {
          setDraggingIndex(selectedIndex);
          setOffset({
            x: x - canvasX,
            y: y - canvasY,
          });
      
          // ✅ 비율 기반 클릭 위치 계산
          const clickXRatio = (x - canvasX) / canvasW;
          const clickYRatio = (y - canvasY) / canvasH;
          setClickOffsetRatio({ x: clickXRatio, y: clickYRatio });
          setInitialDragBbox([...obj.bbox]);
      
          setDraggingThumbnailPos({ x: e.clientX, y: e.clientY });
          setMode("move");
        } 
      };

        const handleMouseMove = (e) => {
        if (!canvasRef.current || draggingIndex === null) return;
      
        const transform = transformRef.current;
        if (!transform) return;
      
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
      
        const updated = [...detectedObjects];
        const obj = { ...updated[draggingIndex] };
      
        if (!Array.isArray(obj.bbox) || obj.bbox.length < 4) {
          console.warn("❌ Invalid bbox on handleMouseMove", obj);
          return;
        }
      
        const newBbox = [...(initialDragBbox ?? obj.bbox)];

        const objWidth = newBbox[2] * transform.scaleX;
        const objHeight = newBbox[3] * transform.scaleY;
      
        // 실제 드래그된 bbox 위치 업데이트
        const newCanvasX = (mouseX - objWidth * clickOffsetRatio.x - transform.offsetX) / transform.scaleX;
        const newCanvasY = (mouseY - objHeight * clickOffsetRatio.y - transform.offsetY) / transform.scaleY;
      
        newBbox[0] = newCanvasX;
        newBbox[1] = newCanvasY;
      
        // 🔥 마우스 커서 기준으로 썸네일 위치 지정
        setDraggingThumbnailPos({
          x: e.clientX,
          y: e.clientY
        });
        
        obj.bbox = newBbox;
        updated[draggingIndex] = obj;
        setDetectedObjects(updated);
      
        requestAnimationFrame(() => {
          drawScene(updated);
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawImageContainWithSideBlur(bgImageRef.current, ctx, canvasRef.current, transform);
          drawMaskBorder(ctx, obj, transform);
        });
      };
      
      
      
      const getThumbnailStyle = (pos, bbox, transform, ratio, zIndex = 2) => {
        if (!pos || !bbox || !transform || !ratio) {
            console.warn("⚠️ getThumbnailStyle called with invalid params", { pos, bbox, transform, ratio });
            return {}; // 안전하게 빈 스타일 반환
          }
        const w = bbox[2] * transform.scaleX;
        const h = bbox[3] * transform.scaleY;

        return {
          position:    "absolute",
          left:        `${pos.x - w * ratio.x}px`,
          top:         `${pos.y - h * ratio.y}px`,
          width:       `${w}px`,
          height:      `${h}px`,
          pointerEvents:"none",
          zIndex,
        };
      };
      
      

      const handleMouseUp = () => {
        if (draggingIndex === null || !transformRef.current) return;
        const transform = transformRef.current;
        const [bx, by, bw, bh] = detectedObjects[draggingIndex].bbox;
      
        // ① 캔버스 내부 픽셀 좌표로 변환
        const canvasX = bx * transform.scaleX + transform.offsetX;
        const canvasY = by * transform.scaleY + transform.offsetY;
        const width   = bw * transform.scaleX;
        const height  = bh * transform.scaleY;
      
        // ② 클릭했던 비율 만큼 더해 컨테이너 내부 좌표로 계산 (뷰포트 오프셋 NO)
        const finalX = canvasX + width  * clickOffsetRatio.x;
        const finalY = canvasY + height * clickOffsetRatio.y;
      
        setFinalThumbnailPos({ x: finalX, y: finalY });
        setDraggingIndex(null);
        setDraggingThumbnailPos(null);
      };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        inputRef.current.click();
    };

    const handleDeleteImage = (e) => {
        e.stopPropagation();
        setImageUrl(null);
        setPreviewUrl(null);
        setImageBase64(null);
    };

        useEffect(() => {
            drawMaskOnly(); // drawScene 대신
            setFinalThumbnailPos(null);
            setDraggingThumbnailPos(null);
        }, [selectedIndex]);
    useEffect(() => {
        const handleResize = () => {
            drawScene();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [detectedObjects, selectedIndex]);

    return (
        <>
            <UndoRedoBox>
                <CommonButton onClick={handleUndo}>
                    <FaUndo style={{margin: 5}}/>
                </CommonButton>
                <CommonButton onClick={handleRedo}>
                    <FaRedo style={{ margin: 5 }}/>
                </CommonButton>
            </UndoRedoBox>
            <DeleteBox>
                <CommonButton
                    className={`upload-button ${className}`}
                    width="120px"
                    height="40px"
                    fontSize="xs"
                    fontWeight={800}
                    radius="sm"
                    bgColor={!imageUrl ? "orange" : "red"}
                    type="fill"
                    onClick={!imageUrl ? triggerFileInput : handleDeleteImage}
                >
                    {!imageUrl ? "이미지 업로드" : "이미지 삭제"}
                </CommonButton>
            </DeleteBox>

            <UploadContainer
                ref={containerRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`preview-area ${className}`}
                $hasImage={!!imageUrl}
            >
                {!imageUrl ? (
                    <UploadBox>
                        <ImageUploaderIcon/>
                        <Text size="sm" $weight={600} color="grey">업로드 버튼을 눌러 이미지 파일을 선택하거나<br />마우스로 끌어오세요.</Text>
                    </UploadBox>
                ) : (
                    <>
                        <BlurredWrapper>
                            <ImageRenderer
                                imageBase64={imageBase64}
                                width={imageWidth}
                                height={imageHeight}
                                detectedObjects={detectedObjects}
                                selectedIndices={selectedIndex}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                canvasRef={canvasRef}
                            />
                            <canvas
                                ref={webglCanvasRef}
                                onMouseDown={handle3DMouseDown}
                                onMouseMove={handle3DMouseMove}
                                onMouseUp={handle3DMouseUp}
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 2, pointerEvents: "none" }}
                            />
                        </BlurredWrapper>

                    </>
                )}

                {/* 업로드 중 Spinner 표시 */}
                {isUploading && (
                    <LoadingBox>
                        <LoadingSpinner />
                        <Text size="base" $weight={500}>업로드중{loadingDots}</Text>
                    </LoadingBox>
                )}

                <UploadInput
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
{/* 🔹 드래그 중 실시간 썸네일 */}
{draggingThumbnailPos && 
draggingIndex !== null && 
detectedObjects?.[draggingIndex]?.thumbnail &&
transformRef.current && (() => {
  const style = getThumbnailStyle(
    finalThumbnailPos,
    draggingThumbnailPos,
    detectedObjects[selectedIndex].bbox,
    transformRef.current,
    clickOffsetRatio,
    2
  );
  return <img src={detectedObjects[draggingIndex].thumbnail} style={style} alt="dragging" />;
})()}


{/* 🔹 드래그 종료 후 고정된 썸네일 */}
{finalThumbnailPos != null && 
selectedIndex != null && 
detectedObjects?.[selectedIndex]?.thumbnail && 
transformRef.current &&
transformRef.current.scaleX && transformRef.current.scaleY &&
(
  <img
    src={detectedObjects[selectedIndex].thumbnail}
    style={getThumbnailStyle(
      finalThumbnailPos,
      detectedObjects[selectedIndex].bbox,
      transformRef.current,
      clickOffsetRatio,
      2
    )}
    alt="final"
  />
)}

            </UploadContainer>
        </>
    );
    });



function smartFilterDuplicates(boxes, iouThreshold = 0.5) {
    const filtered = [];
    for (let i = 0; i < boxes.length; i++) {
        let shouldKeep = true;
        for (let j = 0; j < filtered.length; j++) {
            const iou = calculateIoU(boxes[i], filtered[j]);
            if (iou > iouThreshold) {
                shouldKeep = false;
                break;
            }
        }
        if (shouldKeep) {
            filtered.push(boxes[i]);
        }
    }
    return filtered;
}

function calculateIoU(boxA, boxB) {
    const xA1 = boxA.x;
    const yA1 = boxA.y;
    const xA2 = boxA.x + boxA.width;
    const yA2 = boxA.y + boxA.height;

    const xB1 = boxB.x;
    const yB1 = boxB.y;
    const xB2 = boxB.x + boxB.width;
    const yB2 = boxB.y + boxB.height;

    const interWidth = Math.max(0, Math.min(xA2, xB2) - Math.max(xA1, xB1));
    const interHeight = Math.max(0, Math.min(yA2, yB2) - Math.max(yA1, yB1));
    const interArea = interWidth * interHeight;

    const boxAArea = (xA2 - xA1) * (yA2 - yA1);
    const boxBArea = (xB2 - xB1) * (yB2 - yB1);

    const iou = interArea / (boxAArea + boxBArea - interArea);
    return iou;
}

export default ImageUploader;