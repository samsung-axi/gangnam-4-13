import React, { useState } from "react";
import styles from "./PlanDetail.module.css";
import SpotDetail from "../../../components/modal/SpotDetail";
import TimeBar from "./TimeBar";

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
}

const PlanDetail: React.FC<PlanListProps> = ({ spots, selectedDay }) => {
  const [selectedSpot, setSelectedSpot] = useState<spotResponse | null>(null);
  const handleSpotClick = (spot: spotResponse) => {
    setSelectedSpot(spot);
  };

  return (
    <div className={styles.travel_plan_list_container}>
      {/* 일정 요소 list */}
      {spots
        .filter((spot) => spot.day_x === selectedDay)
        .map((spot, index) => (
          <div className={styles.travel_plan_card_section} key={index}>
            <div className={styles.travel_plan_card_container}>
              <div className={styles.timeline_indicator}>
                <div className={styles.circle}></div>
                <div className={styles.travel_time}>
                  {spot.spot_time ? spot.spot_time.slice(0, 5) : "09:30"}
                </div>
              </div>
              <div
                className={styles.travle_image_container}
                onClick={() => handleSpotClick(spot)}
              >
                <div className={styles.travle_image}>
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
                </div>
                <div className={styles.place_info_container}>
                  <h2>{spot.kor_name}</h2>
                  <h3>{spot.eng_name}</h3>
                  <p className={styles.place_additional_info}>{spot.address}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

      <SpotDetail
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
        spot={selectedSpot!}
        button_purpose="website"
      />
    </div>
  );
};

export default PlanDetail;
