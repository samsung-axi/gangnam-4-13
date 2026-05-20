import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Question.module.scss";
import axios from "axios";
import { API_BASE_URL } from "../../config";

interface Inquiry {
  inquiry_id: number;
  member_id: number;
  title: string;
  content: string;
  created_at: string;
  status: string;
  answer?: string; // 답변 필드 추가
}

function Question() {
  const { inquiry_id } = useParams<{ inquiry_id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [existingAnswer, setExistingAnswer] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // 오전/오후 처리
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12; // 12시간제로 변환

    return `${year}-${month}-${day
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchInquiry = async () => {
      setLoading(true);
      setError(null);

      const numericId = parseInt(inquiry_id || "", 10);

      if (isNaN(numericId)) {
        setError("유효하지 않은 문의 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        console.log("요청 URL:", `${API_BASE_URL}/inquiries/${numericId}`);
        const response = await axios.get(
          `${API_BASE_URL}/inquiries/${numericId}`
        );
        console.log("백엔드에서 받은 응답:", response.data);

        if (response.data.status === "성공" && response.data.data?.inquiry) {
          setInquiry(response.data.data.inquiry);
          if (response.data.data.inquiry.answer) {
            setExistingAnswer(response.data.data.inquiry.answer);
          }
        } else {
          setError(response.data.message || "문의 정보를 찾을 수 없습니다.");
        }
      } catch (err: any) {
        console.error("Error details:", err);
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage =
            err.response.data.message ||
            "문의 정보를 불러오는 데 실패했습니다.";
          console.error("Server error response:", err.response.data);
          setError(errorMessage);
        } else {
          setError("문의 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (inquiry_id) {
      fetchInquiry();
    }
  }, [inquiry_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCompleteAnswer = async () => {
    if (!answer.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const numericId = parseInt(inquiry_id || "", 10);
      const response = await axios.put(
        `${API_BASE_URL}/inquiries/admin/answer/${numericId}`,
        {
          answer: answer,
        }
      );

      if (response.data.status === "성공") {
        alert("답변이 완료되었습니다.");
        setExistingAnswer(answer);
        setAnswer("");
      } else {
        alert(
          response.data.message || "답변 완료 처리 중 오류가 발생했습니다."
        );
      }
    } catch (err: any) {
      console.error("Error details:", err);
      if (axios.isAxiosError(err) && err.response) {
        alert(
          err.response.data.message || "답변 완료 처리 중 오류가 발생했습니다."
        );
      } else {
        alert("답변 완료 처리 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!inquiry) {
    return (
      <div className={styles.not_found}>문의 정보를 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className={styles.question_container}>
      <div className={styles.question_content_container}>
        <div className={styles.question_header}>
          <h1 className={styles.question_title}>제목: {inquiry.title}</h1>
          <p className={styles.question_info}>
            글 번호: {inquiry.inquiry_id} | 작성일:{" "}
            {formatDateTime(inquiry.created_at)} | 상태:{" "}
            {inquiry.answer ? "답변 완료" : "미답변"}
          </p>
        </div>
        <div className={styles.question_main_content_container}>
          <h2 className={styles.question_container_title}>문의 내용</h2>
          <div className={styles.question_content}>{inquiry.content}</div>
        </div>
        <div className={styles.question_answer_container}>
          <h2 className={styles.question_container_title}>답변</h2>
          {existingAnswer ? (
            <div className={styles.question_existing_answer}>
              {existingAnswer}
            </div>
          ) : (
            <>
              <textarea
                className={styles.question_answer_textarea}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력해주세요."
                rows={5}
              />
              <div className={styles.question_final_button_container}>
                <button
                  type="button"
                  className={styles.question_final_button}
                  onClick={handleCompleteAnswer}
                  disabled={!answer.trim()}
                >
                  답변완료
                </button>
              </div>
            </>
          )}
        </div>
        <div className={styles.question_final_button_container}>
          <button
            type="button"
            className={styles.question_final_button}
            onClick={handleGoBack}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
