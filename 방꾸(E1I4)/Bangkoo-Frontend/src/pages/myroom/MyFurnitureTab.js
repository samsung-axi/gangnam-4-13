
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyFurnitureList from "./MyFurnitureList";
import { toggleFurniture, addFurniture, removeFurniture } from "@/features/furniture/furnitureSlice";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import { useApplyPlacement } from "@/hooks/useApplyPlacement";
import { Text } from "../../common/Typography";
import { EmptyBox } from "./css/MyRoom.styled";

export default function MyFurnitureTab({
  onCustomRemove,
  onSelect,
  onGlbSelect,
  setselectedIndex,
  selectedIndex,
  resetObjectPositionRef,
  mode,
  setMode,
  setTutorialStep,
  containerRef,
  setShowAiRecommended,
  canvasRef,
  centerArea,
  onTutorialAdvance,
  uploaderRef,
  sessionIdRef
}) {
  const dispatch = useDispatch();
  const furnitureList = useSelector((state) => state.furniture.list); // ✅ 바로 Redux에서 가져옴

  const [localFurnitureList, setLocalFurnitureList] = useState([]);
  const { uncheck } = useCheckedFurniture();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const parent = canvasRef?.current?.parentElement;
    if (parent) {
      setCanvasSize({
        width: parent.clientWidth,
        height: parent.clientHeight,
      });
    }
  }, [canvasRef]);

  useEffect(() => {
    console.log("🧠 mode 바뀜:", mode);
  }, [mode]);

  const applyPlacement = useApplyPlacement({
    background: canvasRef,
    canvasSize,
    setShowMask: () => {},
    setShowHelper: () => {},
    centerArea,
    handleFileChange: (file) => uploaderRef.current?.handleFileChange(file),
    imageUploaderRef: uploaderRef,
    sessionIdRef: sessionIdRef,
  });

  const handleClick = (e, item, index) => {
    e.stopPropagation();
    if (item.isCustom) {
      onCustomRemove(item);
    } else {
      item.type === "eyeOn"
        ? dispatch(removeFurniture(item.id))
        : dispatch(addFurniture(item.id));
    }

    if (uploaderRef?.current) {
      uploaderRef.current.reference = item.image;
    }

    if (item.originalId !== undefined) {
      uncheck(item.originalId);
    }
  };

  const MyFurnitureDelete = () => {
    setShowAiRecommended(true);
    applyPlacement("remove");

    if (uploaderRef?.current?.updateTransformFromImage) {
      uploaderRef.current.updateTransformFromImage();
    }

    setTimeout(() => {}, 7000);

    if (typeof onTutorialAdvance === "function") {
      onTutorialAdvance();
    }
  };

  useEffect(() => {
    console.log("🚀 furnitureList 변경 감지:", furnitureList);
    setLocalFurnitureList(furnitureList);
  }, [furnitureList]);

  return (
    <>
      {furnitureList.length === 0 ? (
        <EmptyBox>
          <Text size="sm" $weight={500} color="dark">
            이동 혹은 삭제할 가구를 클릭해 주세요.
          </Text>
        </EmptyBox>
      ) : (
        <MyFurnitureList
          furnitureList={localFurnitureList} // ✅ 직접 넘김
          onPlus={handleClick}
          setMode={setMode}
          setTutorialStep={setTutorialStep}
          onMinus={(item, index) => {
            if (!resetObjectPositionRef?.current) {
              console.warn("⚠️ resetObjectPositionRef가 정의되지 않았습니다.");
              return;
            }
            resetObjectPositionRef.current(index);

            if (uploaderRef?.current) {
              uploaderRef.current.setFinalThumbnailPos?.(null);
              uploaderRef.current.setDraggingThumbnailPos?.(null);
              uploaderRef.current.setClickOffsetRatio?.({ x: 0.5, y: 0.5 });
            }

            uploaderRef.current.forceRedraw?.();

            setselectedIndex((prev) => (prev === index ? null : index));

            setTimeout(() => {
              setselectedIndex(index);
              MyFurnitureDelete();
            }, 100);

            if (typeof setTutorialStep === "function") {
              setTutorialStep("2.2");
            }
          }}
          onSelect={(index) => {
            if (typeof setselectedIndex === "function") {
              setselectedIndex((prev) => (prev === index ? null : index));
            }
          }}
          onGlbSelect={(item, index) => {
            if (typeof setselectedIndex === "function") {
              setselectedIndex((prev) => (prev === index ? null : index));
            }
            if (typeof onGlbSelect === "function") {
              onGlbSelect(item, index);
            }
          }}
        />
      )}
    </>
  );
}