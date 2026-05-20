import React, { useState } from "react";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  ModalButton,
  InputRow,
} from "../admin/css/GaguResisterModal"; // 스타일 컴포넌트 분리했다면 여기서 불러옴

function GaguRegisterModal({ handleClose }) {
  const [gaguName, setGaguName] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [model3dUrl, setModel3dUrl] = useState("");
  const handleRegister = () => {
    const newGagu = {
      gaguName,
      description,
      detail,
      price,
      url,
      imageUrl,
      category,
      model3dUrl
    };
    console.log("등록된 가구:", newGagu);
    handleClose(); // 모달 닫기
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h3>가구 등록</h3>
          <CloseButton onClick={handleClose} style={{ cursor: "pointer" }}>
            X
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InputRow>
            <label>가구 이름</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="name"
              value={gaguName}
              onChange={(e) => setGaguName(e.target.value)}
              placeholder="ex) GLLENN 글랜"
            />
          </InputRow>

          <InputRow>
            <label>설명</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex)바스톨, 66cm...."
            />
          </InputRow>
         
          <InputRow>
            <label>상세 설명</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="detail"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="시각적 외형, 스타일 정보를 입력하세요요"
            />
          </InputRow>

          <InputRow>
            <label>가격</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="ex) 790,000"
            />
          </InputRow>

          <InputRow>
            <label>링크(URL)</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ex)http:// ...."
            />
          </InputRow>

          <InputRow>
            <label>이미지(URL)</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="ex)http:// ...."
            />
          </InputRow>

          <InputRow>
            <label>3D(URL)</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="model3dUrl"
              value={model3dUrl}
              onChange={(e) => setModel3dUrl(e.target.value)}
              placeholder="ex)http:// ...."
            />
          </InputRow>

          <InputRow>
            <label>카테고리</label>
            <CommonTextField
              fontSize="sx"
              custom="outline"
              label="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex) 의자"
            />
          </InputRow>
        </ModalBody>

        <ModalFooter>
          <CommonButton
            style={{
              border: "1px solid #F29F05",
              backgroundColor: "white",
              color: "orange",
            }}
            width="120px"
            height="40px"
            onClick={handleClose}
            fontSize="xxs"
            fontWeight="bold"
          >
            취소
          </CommonButton>
          <CommonButton
            width="120px"
            height="40px"
            fontSize="xxs"
            fontWeight="bold"
            onClick={handleRegister}
          >
            등록
          </CommonButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default GaguRegisterModal;
