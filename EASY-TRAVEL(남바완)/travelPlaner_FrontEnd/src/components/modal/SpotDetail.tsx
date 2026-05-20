import React from "react";
import styles from "./SpotDetail.module.css";

interface SpotDetailProps {
  isOpen: boolean;
  onClose: () => void;
  button_purpose: string;
  spot: {
    kor_name: string;
    eng_name: string;
    description: string;
    address: string;
    url: string;
    image_url: string;
    phone_number: string;
    business_hours: string;
    spot_time: string;
  };
}

const SpotDetail: React.FC<SpotDetailProps> = ({
  isOpen,
  onClose,
  spot,
  button_purpose,
}) => {
  const renderButton = () => {
    if (!spot.url) return null;

    if (button_purpose === "website") {
      return (
        <a
          href={spot.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.website_link}
        >
          웹사이트 방문하기
        </a>
      );
    }

    if (button_purpose === "add") {
      return <div className={styles.website_link}>일정 추가하기</div>;
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.close_btn} onClick={onClose}>
          <img src="/icons/close.jpg" alt="닫기" />
        </div>

        {spot.image_url.includes("https://example.com") ||
        spot.image_url.includes("정보없음") ||
        spot.image_url.includes("http://") ? (
          <div className={styles.default_image_container}>
            <img
              className={styles.default_image}
              src="/images/default_spot_image.png"
              alt={spot.kor_name}
            />
          </div>
        ) : (
          <div className={styles.image_container}>
            <img src={spot.image_url} alt={spot.kor_name} />
          </div>
        )}

        <div className={styles.content_container}>
          <h2 className={styles.title}>{spot.kor_name}</h2>
          <h3 className={styles.subtitle}>{spot.eng_name}</h3>

          <div className={styles.info_section}>
            <p className={styles.description}>{spot.description}</p>

            <div className={styles.detail_info}>
              <div className={styles.info_item}>
                <span className={styles.label}>주소</span>
                <span>{spot.address}</span>
              </div>

              {spot.phone_number && (
                <div className={styles.info_item}>
                  <span className={styles.label}>전화번호</span>
                  <span>{spot.phone_number}</span>
                </div>
              )}

              {spot.business_hours && (
                <div className={styles.info_item}>
                  <span className={styles.label}>영업시간</span>
                  <span>{spot.business_hours}</span>
                </div>
              )}
            </div>

            {renderButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetail;
