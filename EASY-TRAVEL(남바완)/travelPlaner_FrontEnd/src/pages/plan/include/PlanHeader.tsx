import React, { useState } from "react";
import Slider from "react-slick";
import styles from "./PlanHeader.module.css";

interface Day {
  day: number; // DAY 1
  date: string; // 1월 21일
}

interface PlanHeaderProps {
  days: Day[]; // days 배열
  destination: string;
  companion_count?: {
    label: string;
    count: number;
  }[];
  ages?: string;
  concepts?: string[];
  name: string;
  selectedDay: number;
  onDayClick: (day: number) => void; // DAY 클릭 이벤트 핸들러
  onNameChange: (newName: string) => void; // 새로운 props 추가
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  days,
  destination,
  companion_count,
  ages,
  concepts,
  name,
  selectedDay,
  onDayClick,
  onNameChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
    if (editedName.trim()) {
      onNameChange(editedName);
    } else {
      setEditedName(name);
    }
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameBlur();
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className={styles.travel_plan_list_header}>
      <div className={styles.travel_plan_list_name}>
        {isEditing ? (
          <input
            className={styles.travel_plan_list_name_input}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyPress}
            autoFocus
          />
        ) : (
          <span onClick={handleNameClick}>{name}</span>
        )}
      </div>

      <div className={styles.travel_plan_list_sub_info}>
        <div className={styles.travel_plan_list_destination}>{destination}</div>
        <div className={styles.travel_plan_list_sub_info_item_value}>
          {companion_count?.map((item) => {
            return (
              <div key={item.label}>
                #{item.label}
                <span>{item.count}명</span>
              </div>
            );
          })}
          {ages && <div>#{ages} </div>}
          {concepts?.map((concept) => {
            return <div key={concept}>#{concept}</div>;
          })}
        </div>
      </div>
      {/* 슬라이더 */}
      <div className={styles.travel_plan_list_content}>
        <div className={styles.travel_plan_list_dates_wrapper}>
          <Slider {...sliderSettings}>
            {days.map(({ day, date }) => (
              <div
                key={day}
                className={`${styles.travel_plan_list_date} ${
                  selectedDay === day ? styles.selected : ""
                }`}
                onClick={() => onDayClick(day)}
              >
                <div className={styles.travel_plan_list_day}>{day}일차</div>
                <div className={styles.travel_plan_list_date_text}>{date}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PlanHeader;
