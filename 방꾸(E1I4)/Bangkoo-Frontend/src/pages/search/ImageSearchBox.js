import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUploadedImage}  from "@/features/search/searchSlice";
import { searchImageUnified } from "@/api/search/search";
import {
    ImageSearchWrapper,
    ImageInputWrapper,
    ImageLinkBox,
    LineStyle,
    DropZone
} from "./css/SearchInput.styled";
import CommonButton from "@/common/CommonButton";
import {Text} from "@/common/Typography";
import CommonTextField from "@/common/CommonTextField";

function ImageSearchBox({ onSearchComplete }) {
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();
    const dispatch = useDispatch();

    const handleSearch = async () => {
        const trimmedUrl = imageUrl.trim();

        try {
            if (imageFile) {
                const localUrl = URL.createObjectURL(imageFile);
                if (typeof onSearchComplete === "function") {
                    onSearchComplete({ previewUrl: localUrl, imageFile }); // ✅ 파일은 콜백으로만 전달
                }
            } else if (trimmedUrl) {
                dispatch(setUploadedImage(trimmedUrl)); // ✅ URL 그대로 저장
                if (typeof onSearchComplete === "function") {
                    onSearchComplete(trimmedUrl); // ✅ 미리보기용
                }
            } else {
                console.warn("🚫 검색 조건 없음: 파일도 URL도 없음");
            }
        } catch (err) {
            console.error("이미지 검색 실패:", err);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImageFile(file);
            dispatch(setUploadedImage(file));
            const localUrl = URL.createObjectURL(file);
            // dispatch(setUploadedImage(localUrl));
            if (onSearchComplete) onSearchComplete(localUrl); // 드래그 업로드도 바로 닫기
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // dispatch(setUploadedImage(file)); // 미리보기 즉시 반영
            const localUrl = URL.createObjectURL(file);
            onSearchComplete?.({ previewUrl: localUrl, imageFile: file });
        }
    };

    return (
        <ImageSearchWrapper>
            <Text size="base" $weight={800}>이미지 검색</Text>

            <Text size="xxs" $weight={600}>파일 업로드</Text>

            <DropZone
                onClick={handleFileClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                $active={dragOver}
            >
                <Text size="xxs" $weight={500} color="darkGrey">
                    여기에 이미지를 드래그하거나 클릭해서 업로드
                </Text>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </DropZone>

            <ImageLinkBox>
                <LineStyle />
                <Text size="xxs" $weight={500} color="darkGrey">또는</Text>
                <LineStyle />
            </ImageLinkBox>

            <Text size="xxs" $weight={600}>이미지 링크</Text>

            <ImageLinkBox>
                <ImageInputWrapper>
                    <CommonTextField
                        placeholder="https://example.com/image.png"
                        height="34px"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        custom="outline"
                        line="grey"
                        fontSize="xxs"
                        onClearAll={() => {
                            setImageUrl("");
                        }}
                        onEnter={handleSearch}
                    />

                </ImageInputWrapper>
                <CommonButton
                    type="full"
                    width="80px"
                    height="34px"
                    onClick={handleSearch}
                    fontSize="xxs"
                >
                    검색
                </CommonButton>
            </ImageLinkBox>

        </ImageSearchWrapper>
    );
}

export default ImageSearchBox;


