import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import usePlanStore from "../../../stores/PlanStore";
import { Trash2 } from "lucide-react"; // 휴지통 아이콘 import

// 모달 컴포넌트
import ConfirmModal from "../../../components/modal/ConfirmModal";
import PromptModal from "../../../components/modal/PromptModal";

// css
import styles from "./PlanModify.module.css";
import SpotDetail from "../../../components/modal/SpotDetail";
import AlertModal from "../../../components/modal/AlertModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

interface spotResponse {
  kor_name: string;
  eng_name: string;
  description: string;
  address: string;
  url: string;
  image_url: string;
  map_url: string;
  latitude: number;
  longitude: number;
  spot_category: number;
  phone_number: string;
  business_status: boolean;
  business_hours: string;
  order: number;
  day_x: number;
  spot_time: string;
  drivingTime?: string;
}

interface PlanListProps {
  spots: spotResponse[];
  selectedDay: number;
  onSpotsUpdate: (updatedSpots: spotResponse[]) => void;
  onAddSpot: (newSpot: spotResponse) => void;
}

const PlanModify: React.FC<PlanListProps> = ({
  spots,
  selectedDay,
  onSpotsUpdate,
  onAddSpot,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isPromptVisible, setPromptVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalWidth, setModalWidth] = useState<string>("100%");
  const [selectedSpot, setSelectedSpot] = useState<spotResponse | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<number | null>(
    null
  );
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const handleSpotClick = (spot: spotResponse) => {
    setSelectedSpot(spot);
  };
  const planStore = usePlanStore();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setModalWidth(`${containerRef.current.offsetWidth}px`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isPromptVisible && isDataLoaded) {
      setIsAlertOpen(true);
    }
  }, [isDataLoaded]);

  // 드래그 앤 드롭 종료 시 처리

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const currentDaySpots = spots.filter((spot) => spot.day_x === selectedDay);
    const reorderedSpots = Array.from(currentDaySpots);
    const [removed] = reorderedSpots.splice(result.source.index, 1);
    reorderedSpots.splice(result.destination.index, 0, removed);

    // order 값 업데이트
    const updatedSpots = spots.map((spot) => {
      if (spot.day_x !== selectedDay) return spot;
      const index = currentDaySpots.indexOf(spot);
      if (index === -1) return spot;
      return {
        ...reorderedSpots[currentDaySpots.indexOf(spot)],
        order: currentDaySpots.indexOf(spot),
      };
    });

    onSpotsUpdate(updatedSpots);
  };

  // 삭제 버튼 클릭 시 모달 열기
  const handleDeleteClick = (index: number) => {
    setSelectedForDelete(index);
    setModalOpen(true);
  };

  // 모달 안에서 삭제 확인 시
  const handleModalConfirm = () => {
    if (selectedForDelete !== null) {
      const currentDaySpots = spots.filter(
        (spot) => spot.day_x === selectedDay
      );
      const updatedSpots = spots.filter((spot, globalIndex) => {
        const currentDayIndex = currentDaySpots.indexOf(spot);
        return (
          spot.day_x !== selectedDay || currentDayIndex !== selectedForDelete
        );
      });

      onSpotsUpdate(updatedSpots);
    }
    setModalOpen(false);
    setSelectedForDelete(null);
  };

  // 모달 닫기
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedForDelete(null);
  };

  // OpenModal 클릭 시 PromptModal 열기
  const handleOpenModalClick = () => {
    setPromptVisible(true);
  };

  // PromptModal 닫기
  const handlePromptClose = () => {
    setPromptVisible(false);
  };

  const handleTimeChange = (spotIndex: number, newTime: dayjs.Dayjs | null) => {
    if (newTime) {
      const currentDaySpots = spots.filter(
        (spot) => spot.day_x === selectedDay
      );
      const updatedSpots = spots.map((spot) => {
        if (spot === currentDaySpots[spotIndex]) {
          return {
            ...spot,
            spot_time: newTime.format("HH:mm"),
          };
        }
        return spot;
      });
      onSpotsUpdate(updatedSpots);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.travel_plan_list_container} ${
          !isPromptVisible ? styles.with_padding_bottom : ""
        }`}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ width: "100%" }}
                >
                  {/* 일정 요소 list */}
                  {spots
                    .filter((spot) => spot.day_x === selectedDay)
                    .map((spot, index) => (
                      <Draggable
                        key={`${spot.order}-${spot.eng_name}`}
                        draggableId={`${spot.order}-${spot.eng_name}`}
                        index={index}
                      >
                        {(dragProvided: any, snapshot: any) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={styles.travel_plan_card_section}
                            style={{
                              ...dragProvided.draggableProps.style,
                              backgroundColor: snapshot.isDragging
                                ? "rgba(0, 0, 0, 0.05)"
                                : "transparent",
                            }}
                          >
                            <div className={styles.travel_plan_card_container}>
                              <div className={styles.timeline_indicator}>
                                <div className={styles.circle}></div>
                                <TimePicker
                                  value={dayjs(`2024-01-01T${spot.spot_time}`)}
                                  onChange={(newTime) =>
                                    handleTimeChange(index, newTime)
                                  }
                                  minutesStep={30}
                                  ampm={false}
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      className: styles.time_picker,
                                    },
                                  }}
                                  format="HH:mm"
                                />
                                <Trash2
                                  size={30}
                                  className={styles.trash_icon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(index);
                                  }}
                                />
                              </div>

                              <div
                                className={styles.travel_image_container}
                                onClick={() => handleSpotClick(spot)}
                              >
                                <div className={styles.travel_image}>
                                  {spot.image_url.includes(
                                    "https://example.com"
                                  ) ||
                                  spot.image_url.includes("정보없음") ||
                                  spot.image_url.includes("http://") ? (
                                    <div
                                      className={styles.default_image_container}
                                    >
                                      <img
                                        className={styles.default_image}
                                        src="/images/default_spot_image.png"
                                        alt={spot.kor_name}
                                      />
                                    </div>
                                  ) : (
                                    <div className={styles.image_container}>
                                      <img
                                        src={spot.image_url}
                                        alt={spot.kor_name}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className={styles.place_info_container}>
                                  <h2>{spot.kor_name}</h2>
                                  <h3>{spot.eng_name}</h3>
                                  <p className={styles.place_additional_info}>
                                    {spot.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </LocalizationProvider>

        {/* 모달 열기 */}
        <div
          className={styles.open_modal_cotanier}
          onClick={handleOpenModalClick}
        >
          <div className={styles.top_btn}>
            <img src="/icons/arrow-top-white.jpg" alt="open"></img>
          </div>
        </div>

        {/* 프롬프트 모달 */}
        <div
          className={`${styles.prompt_modal_container} ${
            isPromptVisible ? "visible" : "none"
          }`}
        >
          <PromptModal
            onClose={handlePromptClose}
            onAddSpot={onAddSpot}
            isDataLoadedProps={setIsDataLoaded}
          />
        </div>
      </div>

      <AlertModal
        isOpen={isAlertOpen}
        content={"에이전트가 일을 끝마쳤어요!"}
        onConfirm={() => setIsAlertOpen(false)}
      />

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        content={"선택하신 일정을 삭제할까요?"}
        confirmText={"삭제"}
        cancelText="취소"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
      <SpotDetail
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        spot={selectedSpot!}
        button_purpose="website"
      />
    </>
  );
};

export default PlanModify;
