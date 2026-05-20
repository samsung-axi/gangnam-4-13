import React, { useState, useEffect , useRef} from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { GridBox, LeftPanel, MainLayout, RightPanel, TabBox } from "./css/MyRoom.styled";
import FurnitureController from "./FurnitureController";
import FurnitureAIController from "./FurnitureAIController";
import CommonTabs from "@/common/CommonTabs";
import { Text } from "@/common/Typography";
import CommonDialog from "@/common/CommonDialog";
import MyFurnitureTab from "./MyFurnitureTab";
import AIFurnitureTab from "./AIFurnitureTab";
import InteriorTab from "./InteriorTab";
import {
    useAIDialog,
    useFurnitureDialog,
    useInteriorDialog,
    useInteriorSaveDialog,
    useSettingDialog
} from "@/hooks/dialog/useFurnitureDialog";
import { useAddFurnitureWithToast } from "@/hooks/furniture/useAddFurnitureWithToast";
import { useMyRoomLogic } from "@/hooks/furniture/useMyRoomLogic";
import { setInitialFurniture } from "@/features/furniture/furnitureSlice";
import { setInterior } from "@/features/furniture/interiorSlice";
import { setRecommendedFurniture } from "@/features/furniture/recommendedSlice";
import TestImage from "@/assets/images/TestImage.png";
import InteriorSave from "./dialog/InteriorSave";
import Setting from "./dialog/Setting";
import AiRecommended from "./dialog/AiRecommended";
import SearchDrawer from "./SearchDrawer";
import ImageUploader from "./ImageUploader";
import { useGlobalInertEffect } from "@/hooks/dialog/useGlobalInertEffect";
import { useSaveInterior } from "@/hooks/useSaveInterior";


// 튜토리얼
import TutorialManager from "@/components/tutorial/TutorialManager";

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedIndex, setselectedIndex] = useState(null);
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const canvasRef = useRef(null);
    const modeRef = useRef(null);
    const [mode, setMode] = useState(null);
    const syncedSetMode = (val) => {
        modeRef.current = val;
        setMode(val);
      };
    const sessionIdRef = useRef(null);
    const uploaderRef = useRef(null);

    const [showAiRecommended, setShowAiRecommended] = useState(false);

    const [redisKey, setRedisKey] = useState(undefined);            //rediskey관련 상태 선언


    // 이미지 등록 시 상태 값 체크용도 "김범석"
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    // const handleImageUploaded = (uploaded) => {
    //     setIsImageUploaded(uploaded);
    // };
    //  여기까지
    const dispatch = useDispatch();
    const furnitureDialog = useFurnitureDialog();
    const interiorDialog = useInteriorDialog();
    const interiorSaveDialog = useInteriorSaveDialog();
    const settingDialog = useSettingDialog();
    const aiDialog = useAIDialog();
    const addFurniture = useAddFurnitureWithToast();
    const { handleConfirmDelete, handleConfirmInteriorDelete } = useMyRoomLogic(furnitureDialog, interiorDialog);
    const saveInterior = useSaveInterior(canvasRef, interiorSaveDialog.closeDialog);
    const resetObjectPositionRef = useRef();
    const restoreInitialImageRef = useRef();
    const [centerArea, setCenterArea] = useState(null);
    useGlobalInertEffect([
        furnitureDialog.open,
        interiorDialog.open,
        interiorSaveDialog.open,
        settingDialog.open,
        aiDialog.open,
    ]);

    // 튜토리얼
    const [tutorialForceStart, setTutorialForceStart] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(null);
    const startTutorial = () => {
        localStorage.removeItem("hasSeenTutorial");
        setTutorialStep(null);            // tutorialStep 초기화
        setTutorialForceStart(false);     // 리셋
        setTimeout(() => {
            setTutorialForceStart(true);    // forceStart를 다시 true로 (강제 리렌더링 유도)
        }, 0);
    };


    const handleSave = () => {
        // 기존 저장 로직
        saveInterior(); // Hook에서 리턴된 함수 실행(태원님)

        // 튜토리얼 단계일 경우 다음 단계로
        if (tutorialStep === "4.2") {
            setTutorialStep("4.3");
        }
    };

    useEffect(() => {
        dispatch(setInitialFurniture([
            { id: 1, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 2, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 3, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 4, image: TestImage, type: "eyeOn", isCustom: false },
        ]));

        dispatch(setInterior([
            { id: 1, image: TestImage, type: "removeButton", text: "첫번째 내방 인테리어" },
            { id: 2, image: TestImage, type: "removeButton", text: "인테리어 설명 인테리어 설명 인테리어 설명" },
            { id: 3, image: TestImage, type: "removeButton", text: "세 번째 인테리어" },
        ]));

    }, [dispatch]);

    const tabList = [
        { id: "my", label: "나의 가구" },
        { id: "recommend", label: "추천 가구" },
        { id: "interior", label: "내 인테리어" },
    ];

    return (
        <MainLayout>
            <LeftPanel>
                <FurnitureController
                    saveClick={interiorSaveDialog.openDialog}
                    aiClick={aiDialog.openDialog}
                    canvasRef={canvasRef} //
                    restoreInitialImageRef={restoreInitialImageRef}
                    onTutorialStart={startTutorial}
                    mode={modeRef.current}
                    centerArea={centerArea} // ⬅️ 전달 //
                    handleFileChange = {(file) => uploaderRef.current?.handleFileChange(file)}
                    onTutorialAdvance={() => {
                        if (tutorialStep === "3.5") setTutorialStep("3.6");
                    }} //
                    tutorialStep={tutorialStep}
                    setTutorialStep={setTutorialStep}
                    setShowAiRecommended={setShowAiRecommended}
                    imageUploaderRef={uploaderRef}
                    sessionIdRef={sessionIdRef}
                />
                <ImageUploader
                    ref={uploaderRef}
                    canvasRef={canvasRef}
                    // onRedisKey={(key)=>{
                    //     console.log("이미지 업로드하고 나온 키값:",key);
                    //     setRedisKey(key);
                    // }}
                    onRedisKey={setRedisKey}  
                    onObjectSelect={(index) => setselectedIndex(index)}
                    resetObjectPositionRef={resetObjectPositionRef}
                    selectedIndex={selectedIndex}    
                    setselectedIndex={setselectedIndex} 
                    onImageUploaded={(uploaded) => {
                        console.log("이미지 업로드 여부:", uploaded);
                    }}

                    setCenterArea={setCenterArea} 
                    restoreInitialImageRef={restoreInitialImageRef}
                    setMode={syncedSetMode}
                    mode={mode}

                    // 튜토리얼
                    isTutorialActive={tutorialStep === "1.1"}
                    className={tutorialStep === "1.1" ? "upload-button" : ""}
                    setIsImageUploaded={setIsImageUploaded}
                    sessionIdRef={sessionIdRef}
                />
                {!isImageUploaded ? (
                    <Text size="sm" $weight={600} >
                        이미지 등록 시
                        <span style={{fontWeight:800}}> 반드시 "가로 사진"</span>
                        으로 등록해주세요.
                    </Text>
                    ) : (
                <Text size="sm" $weight={600} >
                    가구 추가, 이동, 제거가 완료되면
                    <span style={{fontWeight:800}}> 배치 결과 보기</span>
                    버튼을 눌러주세요
                </Text>
                )}
            </LeftPanel>
            <RightPanel>
                <FurnitureAIController
                    settingClick={settingDialog.openDialog}
                    onSearchClick={() => {
                        openDrawer(); // 기존 동작
                        if (tutorialStep === "3.1") {
                            setTutorialStep("3.2"); // ✅ 튜토리얼 스텝 전환
                        }
                    }}
                />
                {/* 검색 drawer 영역*/}
                {isDrawerOpen && (
                    <SearchDrawer
                        onClose={closeDrawer}
                        tutorialStep={tutorialStep}
                        setTutorialStep={setTutorialStep}
                    />
                )}

                <TabBox className={tutorialStep === "4.3" ? "tabs-container" : ""}>
                    <CommonTabs
                        tabs={tabList}
                        current={currentTab}
                        onChange={setCurrentTab}
                        getTabProps={(tab) => ({
                            className: tab.id === "interior" ? "tab-interior" : ""
                        })}
                    />
                </TabBox>
                <GridBox className="grid-container">
                    {currentTab === "my" && 
                    <MyFurnitureTab
                        onCustomRemove={furnitureDialog.openDialog}
                        onGlbSelect={(item, index) => {
                            // console.log("🔥 GLB 클릭 감지됨:", item);
                            setselectedIndex(index);
                            uploaderRef.current?.loadGlbModel(item.model3dUrl);
                            uploaderRef.current.reference = item.image;
                            // loadGlbModelToCanvas(item.image); // 예시
                        }}
                        onSelect={(index) => setselectedIndex(index)}
                        setselectedIndex={setselectedIndex}  // ✅ 이거 꼭 전달!!
                        selectedIndex={selectedIndex}
                        resetObjectPositionRef={resetObjectPositionRef}
                        mode={mode}
                        setMode={syncedSetMode}

                        canvasRef={canvasRef}
                        centerArea={centerArea}
                        onTutorialAdvance={() => {
                            if (tutorialStep === "2.2") setTutorialStep("2.3");
                        }}
                        setShowAiRecommended={setShowAiRecommended}
                        uploaderRef={uploaderRef}
                        // 튜토리얼
                        setTutorialStep={setTutorialStep}
                        sessionIdRef={sessionIdRef}
                    />}
                    {currentTab === "recommend" && <AIFurnitureTab onPlus={addFurniture}  redisKey={redisKey} />}
                    {currentTab === "interior" && <InteriorTab onDelete={interiorDialog.openDelete} onDeleteAll={interiorDialog.openDeleteAll} />}
                </GridBox>
            </RightPanel>

            <CommonDialog
                open={furnitureDialog.open}
                title="알림"
                submitText="제거"
                onClose={furnitureDialog.closeDialog}
                onClick={handleConfirmDelete}
            >
                <Text size="xs" $weight={500}>내가구 목록에서 제거하시겠습니까?</Text>
            </CommonDialog>

            <CommonDialog
                open={interiorDialog.open}
                title="알림"
                submitText="제거"
                onClose={interiorDialog.close}
                onClick={handleConfirmInteriorDelete}
            >
                <Text size="xs" $weight={500}>
                    {interiorDialog.deleteAll
                        ? "사진을 모두 삭제하시겠습니까?"
                        : "사진을 정말 삭제하시겠습니까?"}
                </Text>
            </CommonDialog>

            <CommonDialog
                open={interiorSaveDialog.open}
                title="인테리어 저장"
                submitText="저장"
                onClose={interiorSaveDialog.closeDialog}
                onClick={handleSave}
            >
                <InteriorSave canvasRef={canvasRef}/>
            </CommonDialog>

            <CommonDialog
                open={settingDialog.open}
                title="AI 추천 조건"
                submitText="설정"
                onClose={settingDialog.closeDialog}
                onClick={() => {}}
            >
                <Setting/>
            </CommonDialog>

            <CommonDialog
                open={showAiRecommended}
                title="AI 추천 가구"
                submitText="설정"
                cancel={false}
                submit={false}
                onClose={() => {
                    setShowAiRecommended(false);

                    // 튜토리얼
                    if (tutorialStep === "2.2") {
                        setTutorialStep("2.3");
                    } else if (tutorialStep === "3.6") {
                        setTutorialStep("3.7");
                    }
                }}
            >
                <AiRecommended/>
            </CommonDialog>

            {/* 튜토리얼 */}
            <TutorialManager
                isImageUploaded={isImageUploaded}
                forceStart={tutorialForceStart}
                forceEnd={setTutorialForceStart}
                onStepChange={(step) => setTutorialStep(step)}
                externalStep={tutorialStep}
                currentTab={currentTab}
            />
        </MainLayout>
    );
}

export default MyRoom;