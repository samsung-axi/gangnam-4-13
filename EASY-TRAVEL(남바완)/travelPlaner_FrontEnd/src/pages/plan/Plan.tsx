import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LongBtn from "../../components/buttons/LongBtn";
import ConfirmModal from "../../components/modal/ConfirmModal"; // 모달 컴포넌트
import PlanHeader from "./include/PlanHeader"; // 일정 날짜 헤더 컴포넌트
import styles from "./Plan.module.css";
import axios from "axios";
import PlanModify from "./include/PlanModify";
import usePlanStore from "../../stores/PlanStore";
import useMemberStore from "../../stores/MemberStore";
import { API_BASE_URL } from "../../config";
import AlertModal from "../../components/modal/AlertModal";
import PlanDetail from "./include/PlanDetail";
import { List } from "lucide-react";
import PlanMap from "./include/PlanMap";
import MiniGame from "../minigame/MiniGame";
import TimeBar from "./include/TimeBar";
import SurveyModal from "../../components/modal/SurveyModal";

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

interface planInterface {
  name: string;
  start_date: Date;
  end_date: Date;
  main_location: string;
  ages: string;
  companion_count: {
    label: string;
    count: number;
  }[];
  concepts: string[];
}

const generateDaysArray = (startDate: Date, endDate: Date) => {
  const daysArray = [];
  let currentDate = new Date(startDate);
  let lastDate = new Date(endDate);
  let dayCount = 1;

  while (currentDate <= lastDate) {
    daysArray.push({
      day: dayCount,
      date: `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`,
    });
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }

  return daysArray;
};

const Plan: React.FC<{ newRequest: boolean }> = ({ newRequest }) => {
  const [currentTab, setCurrentTab] = useState<string>("detail");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [planId, setPlanId] = useState<number>();
  // **설문 모달 상태 추가**
  const [isSurveyModalOpen, setSurveyModalOpen] = useState<boolean>(false);

  const memberStore = useMemberStore();
  const { planIdFirst } = useParams();

  const [plan, setPlan] = useState<planInterface>({
    name: "",
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    main_location: "",
    ages: "20대",
    companion_count: [
      {
        label: "",
        count: 0,
      },
    ],
    concepts: [],
  });
  const [spots, setSpots] = useState<spotResponse[]>([]);

  const planStore = usePlanStore();
  const handlePlanName = (newName: string) => {
    planStore.setPlan({ name: newName });
    setPlan({ ...plan, name: newName });
  };

  const navigate = useNavigate();

  // 일정 목록 페이지로 이동
  const handleListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/plans/list");
  };

  // AI 에이전트 요청 (최초 일정 생성)
  useEffect(() => {
    const handleAgentSelect = async () => {
      // 올바르지 않은 접근 시 홈으로
      if (planIdFirst) {
        return;
      }
      if (newRequest === false) {
        navigate("/");
        return;
      }

      setIsLoading(true);
      try {
        const planData = planStore.getPlan();

        // email 추가
        const planDataWithEmail = {
          ...planData,
          email: memberStore.getMemberInfo().email,
        };

        // 화면 표시에 맞게 변환
        const planDataforPrint = {
          name: planData.name,
          start_date: new Date(planData.start_date),
          end_date: new Date(planData.end_date),
          main_location: planData.main_location,
          ages: planData.ages,
          companion_count: planData.companion_count,
          concepts: planData.concepts,
        };
        setPlan(planDataforPrint);

        // 백엔드로 요청
        const response = await axios.post(
          `${API_BASE_URL}/agents/plan`,
          planDataWithEmail,
          {
            withCredentials: true,
          }
        );

        const spotInfos = response.data.data.spots.spots;

        // 장소에 spot_time이 없을 경우 기본값(10:00)으로 설정
        const updatedSpots = spotInfos.map((spot: any) => ({
          ...spot,
          spot_time: spot.spot_time || "10:00",
        }));
        setSpots(updatedSpots);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request aborted:", err.message);
        } else {
          console.error("에이전트 요청 중 오류 발생:", err);
          setMessage(
            "일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요"
          );
          setIsOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    handleAgentSelect();
  }, []);

  // 기존 일정 조회
  const fetchPlanData = async () => {
    try {
      setSpots([]);
      const response = await axios.get(`${API_BASE_URL}/plan_spots/${planId}`, {
        withCredentials: true,
      });

      const planResponse = response.data.data.plan;
      const planDataforStore = {
        name: planResponse.name,
        start_date: new Date(planResponse.start_date),
        end_date: new Date(planResponse.end_date),
        main_location: planResponse.main_location,
        ages: `${planResponse.ages}대`,
        companion_count: JSON.parse(planResponse.companion_count),
        concepts: JSON.parse(planResponse.concepts),
      };
      setPlan(planDataforStore);
      planStore.setPlan({
        ...planDataforStore,
        start_date: planDataforStore.start_date.toISOString(),
        end_date: planDataforStore.end_date.toISOString(),
      });

      const spotInfos = response.data.data.detail;
      const updatedSpots = spotInfos.map((spotInfo: any) => ({
        ...spotInfo.spot,
        ...spotInfo.plan_spot,
      }));
      setSpots(updatedSpots);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (planIdFirst) {
      setPlanId(Number(planIdFirst));
    }
  }, []);

  useEffect(() => {
    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  useEffect(() => {
    if (spots.length > 0) {
      setIsDataLoaded(true);
    }
  }, [spots, isDataLoaded]);

  const days: { day: number; date: string }[] = generateDaysArray(
    plan.start_date,
    plan.end_date
  );

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // 날짜 헤더 클릭
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  // **일정 저장하기 버튼 → 설문 모달 열기**
  const handleSaveClick = async () => {
    if (!planId) {
      setSurveyModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  // **설문 모달에서 제출 시 설문 저장 + 일정 저장**
  const handleSurveySubmit = async (rating: number, comment: string) => {
    setSurveyModalOpen(false);
    try {
      // 1) 설문 API 호출 (예시)
      await axios.post(
        `${API_BASE_URL}/survey`,
        { rating, comment, plan_id: planId },
        { withCredentials: true }
      );

      // 2) 일정 저장 모달(ConfirmModal) 열기
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      setMessage("설문 저장 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
    }
  };

  // ConfirmModal에서 "저장" 버튼 클릭 시 실제 일정 저장
  const handleModalConfirm = async () => {
    setModalOpen(false);
    let concepts =
      typeof plan.concepts !== "string"
        ? JSON.stringify(plan.concepts)
        : plan.concepts;
    let companion_count =
      typeof plan.companion_count !== "string"
        ? JSON.stringify(plan.companion_count)
        : plan.companion_count;
    try {
      // 일정 수정
      if (planId) {
        const response = await axios.post(`${API_BASE_URL}/plans/${planId}`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
          withCredentials: true,
          email: memberStore.getMemberInfo().email,
        });
        console.log("savePlanData", response.data);
        setPlanId(response.data.data.plan_id);
        navigate(`/plans/${response.data.data.plan_id}`);
        setMessage("일정 수정 완료");
        setIsOpen(true);
      } else {
        // 일정 생성
        const response = await axios.post(`${API_BASE_URL}/plans`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
          email: memberStore.getMemberInfo().email,
          withCredentials: true,
        });
        console.log("savePlanData", response.data);
        setMessage("일정 저장 완료");
        setIsOpen(true);
        setPlanId(response.data.data.plan_id);
        navigate(`/plans/${response.data.data.plan_id}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("일정 저장 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
    }
  };

  // 모달 취소
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  // spots 업데이트 함수
  const handleSpotsUpdate = (updatedSpots: spotResponse[]) => {
    setSpots(updatedSpots);
  };

  const handleAddSpot = (newSpot: spotResponse) => {
    const updatedSpot = {
      ...newSpot,
      day_x: selectedDay,
      order: spots.filter((spot) => spot.day_x === selectedDay).length + 1,
    };
    setSpots((prevSpots) => [...prevSpots, updatedSpot]);
  };

  // 체크리스트 아이콘 클릭 시
  const handleCheckListClick = async () => {
    if (planId) {
      navigate(`/checkList/${planId}`);
    } else {
      let concepts =
        typeof plan.concepts !== "string"
          ? JSON.stringify(plan.concepts)
          : plan.concepts;
      let companion_count =
        typeof plan.companion_count !== "string"
          ? JSON.stringify(plan.companion_count)
          : plan.companion_count;
      try {
        const response = await axios.post(`${API_BASE_URL}/plans`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
          email: memberStore.getMemberInfo().email,
          withCredentials: true,
        });
        console.log("savePlanData", response.data);
        setMessage("일정 저장 완료");
        setPlanId(response.data.data.plan_id);
        navigate(`/checkList/${response.data.data.plan_id}`);
      } catch (err) {
        console.error(err);
        setMessage(
          "일정 저장 중 오류가 발생했습니다. 잠시후 다시 시도해주세요"
        );
      }
    }
  };

  return (
    <div className={styles.travel_plan_container}>
      <div className={styles.travel_plan_tab_container}>
        <button className={styles.list_btn} onClick={handleListClick}>
          <List size={32} />
        </button>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "detail" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("detail")}
        >
          일정 확인
        </div>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "modify" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("modify")}
        >
          일정 수정
        </div>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "map" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("map")}
        >
          지도 확인
        </div>
      </div>
      <div className={styles.travel_plan_list_container}>
        {/* PlanHeader 컴포넌트 */}
        <PlanHeader
          destination={plan.main_location}
          name={plan.name}
          days={days}
          companion_count={plan.companion_count}
          ages={plan.ages}
          concepts={plan.concepts}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          onNameChange={handlePlanName}
        />
        <div
          className={styles.travel_plan_list_icon}
          onClick={handleCheckListClick}
        >
          <img src="/icons/memo.jpg" alt="Icon" />
        </div>

        {isLoading ? (
          <div className={styles.loading_container}>
            <p>AI가 여행 일정을 생성하고 있습니다...</p>
            <p>일을 마치면 알림으로 알려드려요!</p>
            <MiniGame />
          </div>
        ) : isDataLoaded ? (
          <>
            {currentTab === "detail" && (
              <div className={styles.plan_time_bar_frame}>
                <TimeBar spots={spots} selectedDay={selectedDay} />
                <PlanDetail spots={spots} selectedDay={selectedDay} />
              </div>
            )}

            {currentTab === "modify" && (
              <div className={styles.plan_time_bar_frame}>
                <TimeBar spots={spots} selectedDay={selectedDay} />
                <PlanModify
                  spots={spots}
                  selectedDay={selectedDay}
                  onSpotsUpdate={handleSpotsUpdate}
                  onAddSpot={handleAddSpot}
                />
              </div>
            )}

            {currentTab === "map" && (
              <PlanMap spots={spots} selectedDay={selectedDay} />
            )}
          </>
        ) : (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>데이터를 불러오고 있습니다.</p>
          </div>
        )}

        {!isLoading && isDataLoaded && currentTab !== "map" && (
          <div className={styles.form_actions_btns}>
            <div className={styles.travle_save_btn}>
              <LongBtn
                type="button"
                content="일정 저장하기"
                onClick={handleSaveClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* 설문 모달 (SurveyModal) */}
      <SurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setSurveyModalOpen(false)}
        onSubmit={handleSurveySubmit}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        content={"해당 플랜을 저장할까요?"}
        confirmText={"저장"}
        cancelText="취소"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <AlertModal
        isOpen={isOpen}
        content={message}
        onConfirm={() => {
          setIsOpen(false);
          if (
            message ===
            "일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요"
          ) {
            navigate("/plan/filter");
          }
        }}
      />
    </div>
  );
};

export default Plan;
