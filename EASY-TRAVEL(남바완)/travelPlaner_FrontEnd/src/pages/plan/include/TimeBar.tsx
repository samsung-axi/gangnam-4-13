import React from "react";
import styles from "./TimeBar.module.css";

interface TimeBarProps {
  spots: {
    spot_time: string;
    day_x: number;
    kor_name: string;
    eng_name: string;
  }[];
  selectedDay: number;
}

const TimeBar: React.FC<TimeBarProps> = ({ spots, selectedDay }) => {
  // 시간을 분으로 변환하는 함수 (예: "09:30" -> 570)
  const getMinutes = (timeString: string) => {
    const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeString || !timeFormat.test(timeString)) {
      return 570;
    }
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // 현재 선택된 날짜의 spots만 필터링
  const daySpots = spots.filter((spot) => spot.day_x === selectedDay);

  return (
    <div className={styles.time_bar_container}>
      <div className={styles.time_bar}>
        <div className={styles.time_marks}>
          {Array.from({ length: 32 }, (_, i) => {
            const hour = Math.floor(i / 2) + 8;
            const minutes = (i % 2) * 30;
            const timeString = `${hour.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`;
            const currentMinutes = hour * 60 + minutes;
            const currentSpot = daySpots.find(
              (spot) => getMinutes(spot.spot_time) === currentMinutes
            );

            return (
              <div
                key={i}
                className={`${styles.time_mark} ${
                  i % 2 === 0 ? "" : styles.line
                }`}
                style={{ top: `${(i * 100) / 32}%` }}
              >
                {i % 2 === 0 && (
                  <>
                    {currentSpot && (
                      <div className={styles.marker_container}>
                        <div className={styles.spot_marker} />
                        <div className={styles.spot_info}>
                          <p className={styles.spot_name}>
                            {currentSpot.kor_name}
                          </p>
                          <p className={styles.spot_time}>
                            {currentSpot.spot_time}
                          </p>
                        </div>
                      </div>
                    )}
                    <span className={styles.time_text}>{timeString}</span>
                  </>
                )}
                {i % 2 === 1 && currentSpot && (
                  <div className={`${styles.marker_container}`}>
                    <div className={styles.spot_marker} />
                    <div className={styles.spot_info}>
                      <p className={styles.spot_name}>{currentSpot.kor_name}</p>
                      <p className={styles.spot_time}>
                        {currentSpot.spot_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeBar;
