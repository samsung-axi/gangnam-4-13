import React, { useState } from "react";
import styles from "./SurveyModal.module.css";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>여행 일정 만족도 조사</h2>

        <div className={styles.questionContainer}>
          <div>
            <p className={styles.question}>
              여행 일정에 대해 어떻게 생각하시나요?
            </p>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`${styles.ratingButton} ${
                    rating === value ? styles.selected : ""
                  }`}
                  onClick={() => handleRatingClick(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={styles.question}>
              추가 의견이 있다면 자유롭게 작성해주세요.
            </p>
            <textarea
              className={styles.textArea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="의견을 입력해주세요"
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleSubmit}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
