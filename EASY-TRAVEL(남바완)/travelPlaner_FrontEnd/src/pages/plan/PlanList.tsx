import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PlanList.module.css";
import { API_BASE_URL } from "../../config";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { Trash2 } from "lucide-react"; // List 아이콘 추가
import AlertModal from "../../components/modal/AlertModal";

interface SavedPlan {
  id: number;
  name: string;
  main_location: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

const PlanMember: React.FC = () => {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans`, {
          withCredentials: true,
        });
        setPlans(response.data.data);
      } catch (error) {
        console.error("일정 목록 조회 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handlePlanClick = (planIdFirst: number) => {
    navigate(`/plans/${planIdFirst}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, planId: number) => {
    e.stopPropagation();
    setSelectedPlanId(planId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlanId) {
      try {
        await axios.delete(`${API_BASE_URL}/plans/${selectedPlanId}`, {
          withCredentials: true,
        });
        setPlans(plans.filter((plan) => plan.id !== selectedPlanId));
        setAlertMessage("일정이 성공적으로 삭제되었습니다.");
        setShowAlertModal(true);
      } catch (error) {
        console.error("일정 삭제 중 오류 발생:", error);
        setAlertMessage("일정 삭제 중 오류가 발생했습니다.");
        setShowAlertModal(true);
      }
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setSelectedPlanId(null);
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.plan_member_container}>
      <h1 className={styles.title}>내 여행 일정</h1>
      {isLoading ? (
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner}></div>
          <p>일정 목록을 불러오는 중입니다...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className={styles.empty_plans}>저장된 여행 일정이 없습니다.</div>
      ) : (
        <div className={styles.plan_grid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={styles.plan_card}
              onClick={() => handlePlanClick(plan.id)}
            >
              <div className={styles.plan_info}>
                <h2>{plan.name}</h2>
                <p className={styles.location}>{plan.main_location}</p>
                <p className={styles.date}>
                  {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                </p>
              </div>
              <div className={styles.created_at}>
                작성일: {new Date(plan.created_at).toLocaleDateString()}
              </div>
              <div className={styles.plan_actions}>
                <button
                  className={styles.delete_btn}
                  onClick={(e) => handleDeleteClick(e, plan.id)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        content={"이 일정을 삭제하시겠습니까?"}
        onConfirm={() => handleDeleteConfirm()}
        onCancel={() => handleDeleteCancel()}
      />

      <AlertModal
        isOpen={showAlertModal}
        content={alertMessage}
        onConfirm={() => setShowAlertModal(false)}
      />
    </div>
  );
};

export default PlanMember;
