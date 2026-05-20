// pages/myroom/dialog/InteriorSave.js
// ✅ 작성자: 김태원
// ✅ 작성 목적: 이미지 캔버스에서 렌더링된 내용을 저장 화면에서 미리보기로 보여주고,
//              사용자로부터 인테리어 설명을 입력받아 저장하는 UI 제공

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExplanation } from "@/features/furniture/interiorSlice";
import { InteriorImageBox, InteriorRoot } from "./css/InteriorSave.styled";
import { Text } from "@/common/Typography";
import CommonTextField from "@/common/CommonTextField";

function InteriorSave({ canvasRef }) {
  const dispatch = useDispatch();

  // 🔸 Redux 전역 상태에서 설명 값 가져오기
  const explanation = useSelector((state) => state.interior.explanation);

  // 🔸 캔버스 미리보기를 위한 base64 이미지 저장용 상태
  const [previewImage, setPreviewImage] = useState(null);

  /**
   * ✅ 최초 마운트 또는 canvasRef가 바뀔 때 실행됨
   * - canvasRef.current로부터 실제 그려진 이미지를 base64로 추출
   * - 이를 통해 <img src={...}> 형태로 미리보기 가능
   */
  useEffect(() => {
    if (canvasRef?.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png"); // 캔버스를 base64 PNG로 변환
      setPreviewImage(dataUrl); // 상태 업데이트 -> 이미지 미리보기 반영
    }
  }, [canvasRef]);

  /**
   * ✅ 설명 입력 필드 변경 시 Redux 상태에 반영
   */
  const handleChange = (e) => {
    dispatch(setExplanation(e.target.value));
  };

  /**
   * ✅ 전체 설명 텍스트 제거
   */
  const handleClear = () => {
    dispatch(setExplanation(""));
  };

  return (
    <InteriorRoot>
      {/* 🔍 인테리어 캔버스 미리보기 영역 */}
      <InteriorImageBox>
        {previewImage ? (
          <img src={previewImage} alt={"내방 이미지"} />
        ) : (
          <p>이미지를 불러오는 중...</p>
        )}
      </InteriorImageBox>

      {/* 📝 사용자에게 설명 입력 필드 제공 */}
      <Text size="xxs" $weight={600}>인테리어 설명</Text>
      <CommonTextField
        className="interior-desc-input"
        placeholder="내방 인테리어 설명을 간단하게 작성해 주세요."
        height="34px"
        value={explanation}
        onChange={handleChange}
        custom="outline"
        line="grey"
        fontSize="xxs"
        onClearAll={handleClear}
      />
    </InteriorRoot>
  );
}

export default InteriorSave;
