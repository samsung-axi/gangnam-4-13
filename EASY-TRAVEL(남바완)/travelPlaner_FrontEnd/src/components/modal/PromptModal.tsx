import React, { useEffect, useState } from "react";
import "./PromptModal.css";
import SearchTextArea from "../input/SearchTextArea";
import axios from "axios";
import usePlanStore from "../../stores/PlanStore";
import { API_BASE_URL } from "../../config";
import ConfirmModal from "./ConfirmModal";
import AlertModal from "./AlertModal";

import { useParams } from "react-router-dom";
import useMemberStore from "../../stores/MemberStore";
import { MapPin, Phone } from "lucide-react";

interface spotInterface {
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

const SpotList: React.FC<{
  spots: spotInterface[];
  onAddSpot: (spot: spotInterface) => void;
  isVisible?: () => void;
}> = ({ spots, onAddSpot }) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<spotInterface | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const handleAddClick = (e: React.MouseEvent, spot: spotInterface) => {
    e.stopPropagation();
    setSelectedSpot(spot);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (selectedSpot) {
      onAddSpot(selectedSpot);
    }
    setShowConfirmModal(false);
    setIsAlertOpen(true);
  };

  return (
    <div className="spot-list-container">
      <ul className="spot-list">
        {spots.map((spot) => (
          <li key={spot.kor_name} className="spot-item">
            <div className="spot-image">
              <img src={spot.image_url} alt={spot.kor_name} />
            </div>
            <div className="spot-info">
              <div className="spot-content">
                <h3 className="spot-name">{spot.kor_name}</h3>
                <p className="spot-description">{spot.description}</p>
                <div className="spot-details">
                  <p className="spot-address">
                    <MapPin /> {spot.address}
                  </p>
                  {spot.phone_number && (
                    <p className="spot-phone">
                      <Phone />
                      {spot.phone_number}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="add-spot-btn"
                onClick={(e) => handleAddClick(e, spot)}
              >
                일정에 추가
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={showConfirmModal}
        content="일정에 추가하시겠습니까?"
        confirmText="추가"
        cancelText="취소"
        onConfirm={(e) => {
          e.stopPropagation();
          handleConfirm();
        }}
        onCancel={(e) => {
          e.stopPropagation();
          setShowConfirmModal(false);
        }}
      />
      <AlertModal
        isOpen={isAlertOpen}
        content={"추가 되었습니다."}
        onConfirm={() => setIsAlertOpen(false)}
      />
    </div>
  );
};
interface PromptModalProps {
  onClose?: () => void;
  onAddSpot: (spot: spotInterface) => void;
  // 데이터 로드 여부를 부모 컴포넌트에 전달하는 함수 (알림 기능 구현 위함.)
  isDataLoadedProps: (isDataLoaded: boolean) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({
  onClose,
  onAddSpot,
  isDataLoadedProps,
}) => {
  const { planIdFirst } = useParams();
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>(
    "새로운 추천을 받고 싶으시다면 에이전트를 선택해주세요!"
  );
  const [spots, setSpots] = useState<spotInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const planStore = usePlanStore();
  const memberStore = useMemberStore();

  const agents = [
    { id: "cafe", label: "카페", icon: "/icons/cafe_agent.jpg" },
    {
      id: "restaurant",
      label: "맛집",
      icon: "/icons/restaurant_agent.jpg",
    },
    { id: "site", label: "관광", icon: "/icons/site_agent.jpg" },
    {
      id: "accommodation",
      label: "숙소",
      icon: "/icons/accommodation_agent.jpg",
    },
  ];

  useEffect(() => {
    const handleSubmit = async () => {
      if (!selectedAgent) {
        setAlertMessage("에이전트가 선택되지 않았어요.");
        return;
      }
      if (!promptText.trim()) {
        setAlertMessage("요청할 내용을 입력해주세요");
        return;
      }

      const planInfo = planStore.getPlan();
      //planInfo의 start_date와 end_date는 문자열이므로, date타입으로 변환해야 함.
      const planData = {
        ...planInfo,
        start_date: new Date(planInfo.start_date),
        end_date: new Date(planInfo.end_date),
        plan_id: planIdFirst ? parseInt(planIdFirst) : undefined,
        email: memberStore.getMemberInfo().email,
      };
      console.log("planData: ", planData);

      try {
        setIsLoading(true);
        setIsDataLoaded(false);
        isDataLoadedProps(false);
        const response = await axios.post(
          `${API_BASE_URL}/agents/${selectedAgent}?prompt=${promptText}`,
          planData,
          {
            withCredentials: true,
          }
        );

        const spots = response.data.data.spots;
        setSpots(spots);
        setIsDataLoaded(true);
        isDataLoadedProps(true);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage("서버 요청 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };
    handleSubmit();
  }, [promptText]);

  return (
    <div id="prompt-modal-container">
      <div className="top-btn" onClick={onClose}>
        <img src="/icons/arrow-bottom-white.jpg" alt="close" />
      </div>
      <div className="cotent-container">
        <div className={`modal-title-container`}>
          <div className="radio-group">
            {agents.map((agent) => (
              <label
                className={`agent_radio_btn ${
                  selectedAgent === agent.id ? "active" : ""
                }`}
                key={agent.id}
                htmlFor={agent.id}
              >
                <img
                  className="agent_radio_icon"
                  src={agent.icon}
                  alt={agent.label}
                />
                <input
                  type="radio"
                  key={agent.id}
                  id={agent.id}
                  name="agent"
                  checked={selectedAgent === agent.id}
                  onChange={() => {
                    setSelectedAgent(agent.id);
                    setSelectedAgentName(agent.label);
                  }}
                />
                {agent.label}
              </label>
            ))}
          </div>
        </div>
        {isDataLoaded ? (
          <div className="spots_container">
            <p className="prev_prompt_text">{promptText}에 대한 응답입니다.</p>
            <SpotList spots={spots} onAddSpot={onAddSpot} />
          </div>
        ) : (
          <div></div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <p className="modal-message">
              {selectedAgent === ""
                ? `${alertMessage}`
                : `${selectedAgentName} 에이전트가 정보를 찾고 있어요...`}
            </p>
            <img
              className="loading-gif"
              src="/images/loading.gif"
              alt="loading"
            />
          </div>
        ) : (
          <div className="prompt-message-content">
            <p className="modal-message">
              {selectedAgent === ""
                ? `${alertMessage}`
                : `${selectedAgentName} 에이전트에게 원하시는 정보를 전달해보세요!`}
            </p>
            <SearchTextArea setPromptText={setPromptText} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptModal;
