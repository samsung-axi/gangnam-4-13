import React from "react";
import { AddItem, FurnitureGrid, ImageBox } from "./css/MyRoom.styled";
import CommonImageBox from "../../common/CommonImageBox";
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as MinusIcon } from "../../assets/images/MinusIcon.svg";
import useFurnitureItem from "../../hooks/furniture/useFurnitureItems"; // 훅 사용

function MyFurnitureList({ furnitureList = [], onPlus, onMinus, onSelect, onGlbSelect, setMode, setTutorialStep }) {
  const { furnitureItems, handleminus } = useFurnitureItem(furnitureList);

  console.log("6.내 가구리스트 렌더, props, furnitureList:", furnitureList);

  return (
    <FurnitureGrid>
      {furnitureItems.map((item, index) => (
        <ImageBox
          className={`furniture-item ${index === 0 ? "first-item" : ""} ${index === furnitureItems.length - 1 ? "last-item" : ""}`}
          key={item.id}
        >
          {item.type === "addFurniture" && (
            <AddItem>
              <CommonIconButton
                icon={<MinusIcon />}
                width="28px"
                height="28px"
                type="full"
                color="red"
                onClick={() => {
                  handleminus(item.image); // ✅ 리스트에서 제거
                //   onMinus(item, index);    // ✅ 캔버스에서 제거
                }}
              />
            </AddItem>
          )}
          <CommonImageBox
            image={item.image}
            type={item.type}
            item={item}
            index={index}
            setMode={setMode}
            onPlus={(e) => onPlus(e, item, index)}
            onMinus={(e) => onMinus(e, item, index)} // ✅ e, item, index 다 넘김
            onClick={() => {
              const isGlb = item.model3dUrl?.toLowerCase().endsWith(".glb");
              if (isGlb) {
                onGlbSelect(item, index);
              } else {
                onSelect(index);
              }
              const isLast = index === furnitureItems.length - 1;
              if (isLast) {
                setTutorialStep && setTutorialStep("3.5");
              }
            }}
          />
        </ImageBox>
      ))}
    </FurnitureGrid>
  );
}

export default MyFurnitureList;
