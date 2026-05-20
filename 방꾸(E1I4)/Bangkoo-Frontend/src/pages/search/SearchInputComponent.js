import React, {useState, useRef, useEffect} from "react";
import { useDispatch } from "react-redux";
import {
    setUploadedImage,
    setKeyword,
} from "@/features/search/searchSlice";
import {
    SearchRoot,
    PreviewImage,
    InputBox,
    VoiceBox
} from "./css/SearchInput.styled"
import CommonIconButton from "@/common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "@/assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "@/assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "@/assets/images/MenuIcon.svg";
import { ReactComponent as ImageIcon } from "@/assets/images/ImageIcon.svg";
import CommonTextField from "@/common/CommonTextField";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import useSearchDialog from "@/hooks/dialog/useSearchDialog";
import CommonDialog from "@/common/CommonDialog";

const SearchInputComponent = ({
                                  shadow,
                                  border,
                                  onFocus,
                                  handleClickCategory,
                                  onClickImage,
                                  imagePreviewUrl,
                                  imageFile,
                                  onClearImage,
                                  onCloseSearchTerm,
                                  onSearch,
                                  inputValue,
                                  setInputValue
        }) => {
    const dispatch = useDispatch();
    const recognitionRef = useRef(null); // 음성 인식 인스턴스 저장
    const fileRef = useRef(null);

    const { updateKeyword } = useSearchHistory();
    const [isListening, setIsListening] = useState(false); // 음성

    const {
        dialogOpen,
        dialogMessage,
        dialogTitle,
        openDialog,
        closeDialog
    } = useSearchDialog();

    const handleTextChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        updateKeyword(value); // 상태 변경
        dispatch(setKeyword(value));
    };

    const handleClearAll = () => {
        setInputValue("");
        updateKeyword("");
        dispatch(setKeyword(""));
        dispatch(setUploadedImage(null)); // 상태 초기화

        if (typeof onClearImage === "function") {
            onClearImage(); // 부모에서 미리보기까지 제거되도록 연결
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (typeof setInputValue === "function") {
                setInputValue(e.target.value.trim()); 
            }
            if (typeof onSearch === "function") {
                onSearch(e.target.value.trim()); // 검색 실행
            }
            if (typeof onCloseSearchTerm === "function") {
                onCloseSearchTerm();
            }
        }
    };

    useEffect(() => {
        if (imageFile instanceof File) {
            fileRef.current = imageFile;
        } else {
            fileRef.current = null;
        }
    }, [imageFile]);

    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            openDialog("이 브라우저는 음성 인식을 지원하지 않습니다.\n크롬을 사용해주세요.");
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "ko-KR";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let finalTranscript = "";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            finalTranscript = event.results[0][0].transcript;
        };
        recognition.onend = async () => {
            setIsListening(false);
            if (finalTranscript.trim()) {
                setInputValue(finalTranscript);
                updateKeyword(finalTranscript);
                dispatch(setKeyword(finalTranscript));
                if (typeof onSearch === "function") {
                    await onSearch(finalTranscript); // 검색 실행
                }
            } else {
                console.warn("🎤 음성 결과 없음");
            }
        };
        
        recognition.onerror = (event) => {
            console.error("음성 인식 오류:", event.error);
            openDialog(
                event.error === "not-allowed"
                    ? "마이크 사용 권한이 차단되었습니다. 브라우저 설정을 확인해주세요."
                    : event.error === "no-speech"
                        ? "음성이 감지되지 않았어요. 다시 시도해주세요."
                        : "음성 인식 중 문제가 발생했습니다."
            );
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <SearchRoot $shadow={shadow} $border={border} >
            <CommonIconButton
                type={"none"}
                icon={<MenuIcon/>}
                onClick={handleClickCategory}
            />
            {imagePreviewUrl && typeof imagePreviewUrl === "string" && (
                <PreviewImage src={imagePreviewUrl} alt="Preview" />
            )}
            <InputBox>
                <CommonTextField
                    fontSize="base"
                    placeholder="ex) 빨간색 모던한 의자"
                    value={inputValue}
                    onChange={handleTextChange}
                    onFocus={onFocus}
                    imagePreviewUrl={imagePreviewUrl}
                    onClearAll={handleClearAll}
                    onKeyDown={handleKeyDown}
                />
            </InputBox>

            <CommonIconButton
                type={"none"}
                icon={<ImageIcon/>}
                onClick={onClickImage}
            />
            <VoiceBox $active={isListening}>
                <CommonIconButton
                    type={"none"}
                    icon={<VoiceIcon  />}
                    onClick={startVoiceSearch}
                />
            </VoiceBox>

            <CommonIconButton
                type={"none"}
                icon={<SearchIcon />}
                onClick={() => {
                    if (typeof onSearch === "function") {
                        onSearch(inputValue); // 검색 버튼 클릭 시 실행
                    }
                }}
            />

            {dialogOpen && (
                <CommonDialog
                    open={dialogOpen}
                    onClose={closeDialog}
                    title={dialogTitle}
                    children={dialogMessage}
                    cancel={false}
                    onClose={closeDialog}
                    onClick={closeDialog}
                    confirmText="확인"
                />
            )}
        </SearchRoot>
    )
}

export default SearchInputComponent;