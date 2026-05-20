import React, { useEffect, useRef } from "react";
import LoadKakaoMap from "./LoadPlanMap";

// Plan.tsx 등에서 사용하는 동일한 spotResponse 타입
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
// PlanMap 컴포넌트 Props
interface PlanMapProps {
  spots: spotResponse[];
  selectedDay: number;
}

const PlanMap: React.FC<PlanMapProps> = ({ spots, selectedDay }) => {
  // 지도 표시할 div를 참조할 ref
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // kakao 객체가 로드될 때까지 대기
    const initMap = () => {
      if (!window.kakao?.maps || !mapRef.current) {
        setTimeout(initMap, 100);
        return;
      }

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 8,
      });

      console.log("===== PlanMap useEffect called =====");
      console.log("1) spots:", spots);
      console.log("2) selectedDay:", selectedDay);
      console.log("3) window.kakao:", window.kakao);
      console.log("4) mapRef:", mapRef.current);

      // 2) 현재 선택된 일자(day_x)에 해당하는 spots만 필터링
      const daySpots = spots.filter((spot) => spot.day_x === selectedDay);
      const bounds = new window.kakao.maps.LatLngBounds();

      // 3) 마커 생성
      daySpots.forEach((spot, index) => {
        console.log(`Creating marker #${index} for`, spot.kor_name);

        const markerPosition = new window.kakao.maps.LatLng(
          spot.latitude,
          spot.longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 지도의 범위(bounds)에 마커 좌표를 포함
        bounds.extend(markerPosition);

        // (선택) 마커 호버 시 인포윈도우 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px; font-size:12px;">${spot.kor_name}</div>`,
        });
        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          infowindow.open(map, marker);
        });
        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          infowindow.close();
        });
      });

      // 4) 표시할 마커가 하나 이상이라면, 모든 마커가 보이도록 지도 범위 조정
      if (daySpots.length > 0) {
        console.log("daySpots found:", daySpots.length);
        map.setBounds(bounds);
      } else {
        console.log("No daySpots for selected day:", selectedDay);
      }
    };

    initMap();
  }, [spots, selectedDay]);

  // 지도 표시할 div
  return (
    <div id="kakaomap" style={{ width: "100%", height: "500px" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          // 필요 시 배경색을 지정해 컨테이너 크기 확인
          backgroundColor: "rgba(0, 255, 0, 0.3)",
        }}
      />
    </div>
  );
};

export default PlanMap;
