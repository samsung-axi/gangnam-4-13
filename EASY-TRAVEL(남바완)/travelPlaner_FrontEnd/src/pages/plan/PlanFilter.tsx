import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar, { CalendarProps } from "react-calendar";
import LongBtn from "../../components/buttons/LongBtn";
import NormalInput2 from "../../components/input/NormalInput2";
import {
  Cloudy,
  Cloud,
  Sun,
  CloudRain,
  AlertCircle,
  Snowflake,
  Umbrella,
} from "lucide-react";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import usePlanStore from "../../stores/PlanStore";

//css import
import "react-calendar/dist/Calendar.css";
import styles from "./PlanFilter.module.css";
import AlertModal from "../../components/modal/AlertModal";

// 가능한 날씨 상태
type WeatherType =
  | "맑음"
  | "구름많음"
  | "흐림"
  | "비/눈"
  | "비"
  | "눈"
  | "소나기";

// 날씨 상태 인터페이스 (나중에 API 연동 시 사용할 error 옵션 포함)
interface WeatherState {
  type: WeatherType;
  error?: boolean;
}

// 일정(달력) 컴포넌트
interface DateSelectorProps {
  selectedDateRange: [Date, Date] | null;
  setSelectedDateRange: React.Dispatch<
    React.SetStateAction<[Date, Date] | null>
  >;
  setStart_date: (date: Date) => void;
}

// 일행 인터페이스
interface Companion {
  label: string;
  count: number;
}

const ages = ["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대"];

const accomodation_concept = [
  "호텔",
  "리조트",
  "캠핑",
  "글램핑",
  "한옥",
  "풀빌라",
  "게스트 하우스",
];

const site_concept = [
  "기념일",
  "역사",
  "자연",
  "예술",
  "도시",
  "전통",
  "바다",
  "산",
  "가족",
  "데이트",
  "힐링",
];

const restaurant_concept = ["낮술", "해산물", "고기", "채식", "브런치"];

const cafe_concept = ["모던 카페", "야외 카페", "감성 카페", "느좋 카페"];

const purposes = [
  ...accomodation_concept,
  ...site_concept,
  ...restaurant_concept,
  ...cafe_concept,
];

// 일정(달력) 컴포넌트
const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDateRange,
  setSelectedDateRange,
  setStart_date,
}) => {
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date()); // 현재 활성화된 달 상태

  // 날짜 변경 이벤트 처리
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value) && value.length === 2) {
      setSelectedDateRange(value as [Date, Date]);
      setStart_date(value[0] as Date);
    }
  };

  // 이전 달로 이동
  const handlePrevMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActiveStartDate(
      new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const handleNextMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActiveStartDate(
      new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className={styles.travel_schedule_section}>
      <h2 className={styles.section_title}>2. 일정</h2>
      <div className={styles.calendar_container}>
        {/* 달력 */}
        <div className={styles.calendar_wrapper}>
          {/* 이전 달 버튼 */}
          <button
            className={`${styles.calendar_nav_button} ${styles.prev_button}`}
            onClick={handlePrevMonth}
          >
            <img src={"/icons/arrow_back.jpg"} alt="이전 달" />
          </button>
          <Calendar
            onChange={handleDateChange}
            selectRange
            className={styles.custom_calendar}
            locale="ko-KR"
            minDate={new Date()}
            activeStartDate={activeStartDate} // 현재 활성화된 월
            nextLabel={null} // 내부 '>' 버튼 제거
            prevLabel={null} // 내부 '<' 버튼 제거
            next2Label={null} // 내부 '>>' 버튼 제거
            prev2Label={null} // 내부 '<<' 버튼 제거
            formatDay={(locale, date) => date.getDate().toString()} // 날짜에서 "일" 제거
            showFixedNumberOfWeeks={true}
          />
          {/* 다음 달 버튼 */}
          <button
            className={`${styles.calendar_nav_button} ${styles.next_button}`}
            onClick={handleNextMonth}
          >
            <img src="/icons/arrow_forward.jpg" alt="다음 달"></img>
          </button>
        </div>
      </div>

      {/* 선택된 날짜 표시 */}
      {selectedDateRange && (
        <p className={styles.selected_date}>
          <span>
            {`${selectedDateRange[0].toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })} ~ ${selectedDateRange[1].toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}
          </span>
        </p>
      )}
    </div>
  );
};

// 날씨 정보 컴포넌트
const WeatherAlert: React.FC<{
  selectedX: number | null;
  selectedY: number | null;
  start_date: string;
}> = ({ selectedX, selectedY, start_date }) => {
  const url =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  // 기본 날씨 상태 설정 (error, setWeatherState는 API 연동 전까지는 불필요)
  const [weatherState, setWeatherState] = useState<WeatherState>({
    type: "맑음",
  });

  // 날씨 상태에 따른 아이콘 선택 함수
  const getWeatherIcon = (weatherType: WeatherType): JSX.Element => {
    switch (weatherType) {
      case "맑음":
        return <Sun className={styles.weather_icon} />;
      case "흐림":
        return <Cloud className={styles.weather_icon} />;
      case "구름많음":
        return <Cloudy className={styles.weather_icon} />;
      case "비":
        return <Umbrella className={styles.weather_icon} />;
      case "눈":
        return <Snowflake className={styles.weather_icon} />;
      case "소나기":
        return <CloudRain className={styles.weather_icon} />;
      case "비/눈":
        return <CloudRain className={styles.weather_icon} />;
      default:
        return (
          <AlertCircle
            className={`${styles.weather_icon} ${styles.text_error}`}
          />
        );
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const base_date = start_date.split("-").join("");
        const response = await axios.get(url, {
          params: {
            serviceKey: WEATHER_API_KEY,
            pageNo: 1,
            numOfRows: 11,
            dataType: "JSON",
            base_date: base_date,
            base_time: "1400",
            nx: selectedX,
            ny: selectedY,
          },
        });
        console.log(response.data.response.body.items.item);
        if (response.data.response.body.items.item) {
          const weatherDatas = response.data.response.body.items.item;
          const skyData = weatherDatas.filter(
            (data: any) => data.category === "SKY"
          );
          const rainData = weatherDatas.filter(
            (data: any) => data.category === "PTY"
          );
          console.log(skyData);
          console.log(rainData);

          if (rainData && rainData[0].obsrValue === 0) {
            switch (skyData[0].obsrValue) {
              case "1":
                setWeatherState({
                  type: "맑음",
                });
                break;
              case "3":
                setWeatherState({
                  type: "구름많음",
                });
                break;
              case "4":
                setWeatherState({
                  type: "흐림",
                });
                break;
            }
          } else {
            switch (rainData[0].obsrValue) {
              case "1":
                setWeatherState({
                  type: "비",
                });
                break;
              case "2":
                setWeatherState({
                  type: "비/눈",
                });
                break;
              case "3":
                setWeatherState({
                  type: "눈",
                });
                break;
              case "4":
                setWeatherState({
                  type: "소나기",
                });
                break;
            }
          }
        }

        console.log(weatherState);
      } catch (error) {
        console.error("날씨 데이터 가져오기 실패:", error);
      }
    };
    fetchWeatherData();
  }, [selectedX, selectedY, start_date]);

  return (
    <div className={styles.weather_container}>
      <div className={styles.weather_alert_card}>
        <div className={styles.weather_icon_wrapper}>
          {getWeatherIcon(weatherState.type)}
        </div>
        <div className={styles.weather_content}>
          <h3 className={styles.weather_title}>
            예상 날씨 - {weatherState.type}
          </h3>
          <p className={styles.weather_update_time}>
            {start_date} 기준 날씨 정보입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const PlanFilterSelector: React.FC<{
  changeRequestState: (newRequest: boolean) => void;
}> = ({ changeRequestState }) => {
  const navigate = useNavigate();
  const setPlan = usePlanStore((state) => state.setPlan);

  // 유효성 모달 메시지
  const [message, setMessage] = useState<string>("");
  // 유효성 모달 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >(null);

  const [region, setRegion] = useState<string>(""); // 지역 입력값
  const [allRegions, setAllRegions] = useState<any[]>([]); // 모든 지역 리스트
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]); // 필터링된 지역 리스트
  const [selectedAge, setSelectedAge] = useState<string | null>(null); // 나이
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]); // 목적
  const [selectedX, setSelectedX] = useState<number | null>(60); // 날씨 api x좌표 기본값 서울 특별시
  const [selectedY, setSelectedY] = useState<number | null>(127); // 날씨 api y좌표 기본값 서울 특별시
  const [start_date, setStart_date] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  }); // 날씨 api 시작일

  // 매핑 테이블
  const provinceMappings: Record<string, string> = {
    강원특별자치도: "강원도",
    충청북도: "충북",
    충청남도: "충남",
    전북특별자치도: "전라북도",
    전라남도: "전남",
    경상북도: "경북",
    경상남도: "경남",
    제주특별자치도: "제주도",
  };

  // 모든 지역 데이터를 가져오는 함수
  const fetchAllRegions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/regions/all`); // API 호출
      const divisions = response.data.data.divisions;
      setAllRegions(divisions); // 전체 지역 데이터 저장
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 날짜 변경 이벤트 핸들러
  const handleStart_date = (date: Date) => {
    setStart_date(date.toISOString().split("T")[0]);
  };

  // 사용자가 입력한 값에 따라 필터링
  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegion(value); // 입력값 업데이트

    // 매핑 테이블에서 공식 명칭으로 변환
    const mappedProvinces = Object.keys(provinceMappings).filter((key) =>
      provinceMappings[key].includes(value)
    );

    // 입력값 또는 변환된 값에 따라 필터링
    const filtered = allRegions.filter(
      (region) =>
        mappedProvinces.includes(region.city_province) ||
        region.city_province.includes(value) ||
        region.city_county.includes(value)
    );
    setFilteredRegions(filtered); // 필터링된 결과 업데이트
  };

  // 사용자가 리스트에서 지역 선택 시 상태 저장
  const handleRegionSelect = (selectedRegion: string, x: number, y: number) => {
    setRegion(selectedRegion);
    setSelectedX(x);
    setSelectedY(y);
    setFilteredRegions([]); // 리스트 초기화
  };

  const [companions, setCompanions] = useState<Companion[]>([
    { label: "성인", count: 0 },
    { label: "청소년", count: 0 },
    { label: "어린이", count: 0 },
    { label: "영유아", count: 0 },
    { label: "반려견", count: 0 },
  ]);

  // 동반자 수 변경 이벤트 핸들러
  const handleCompanionChange = (label: string, delta: number) => {
    // 이전 동반자 상태를 기반으로 동반자 수를 업데이트
    setCompanions((prevCompanions) =>
      // 동반자 배열을 순회하며 특정 label에 해당하는 동반자의 count 값을 업데이트
      prevCompanions.map(
        (companion) =>
          companion.label === label // label이 일치하는 동반자를 찾음
            ? // 기존 동반자 정보는 그대로 유지하고 count를 delta만큼 변경하되 최소값은 0으로 제한
              { ...companion, count: Math.max(0, companion.count + delta) }
            : companion // label이 일치하지 않으면 기존 동반자 데이터를 그대로 반환
      )
    );
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prevSelected) =>
      prevSelected.includes(purpose)
        ? prevSelected.filter((item) => item !== purpose)
        : [...prevSelected, purpose]
    );
  };

  // 일정 계획 데이터 전송 이벤트 핸들러(완료 버튼 클릭시)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (region === "") {
      setMessage("지역을 입력해주세요.");
      setIsOpen(true);
      return;
    }
    if (selectedDateRange === null) {
      setMessage("날짜를 선택해주세요.");
      setIsOpen(true);
      return;
    }
    if (selectedAge === null) {
      setMessage("연령대를 선택해주세요.");
      setIsOpen(true);
      return;
    }
    if (companions.every((companion) => companion.count === 0)) {
      setMessage("일행을 선택해주세요.");
      setIsOpen(true);
      return;
    }
    if (selectedPurposes.length === 0) {
      setMessage("목적을 선택해주세요.");
      setIsOpen(true);
      return;
    }

    try {
      // 날짜를 MySQL의 DATE 형식(YYYY-MM-DD)으로 변환
      const formatToDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedDateRange = selectedDateRange
        ? {
            start_date: formatToDate(selectedDateRange[0]),
            end_date: formatToDate(selectedDateRange[1]),
          }
        : null;

      const filteredCompanions = companions.filter(
        (companion) => companion.count > 0
      );

      // PlanStore에 데이터 저장
      setPlan({
        main_location: region,
        start_date: formattedDateRange?.start_date || "",
        end_date: formattedDateRange?.end_date || "",
        ages: selectedAge || "",
        companion_count: filteredCompanions,
        concepts: selectedPurposes,
      });

      // 플랜 페이지로 이동
      // 올바른 과정임을 알림
      changeRequestState(true);
      navigate("/plans/");
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
      alert("여행 계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // useEffect에서 API 호출
  useEffect(() => {
    fetchAllRegions();
  }, []);

  return (
    <form className={styles.travel_plan_container} onSubmit={handleSubmit}>
      <h1 className={styles.travel_plan_header}>
        이번 여행에 대해 알려주세요!
      </h1>
      <p className={styles.travel_plan_description}>
        맞춤 여행 플랜을 준비하고 있습니다.
      </p>

      <div className={styles.travel_region_section}>
        <h2 className={styles.section_title}>1. 지역</h2>
        <div className={styles.region_input_container}>
          {/* 입력 필드 */}
          <NormalInput2
            type="text"
            value={region}
            placeholder="지역을 입력해주세요"
            onChange={handleRegionChange}
            className={`${styles.NormalInput_box} ${
              region && filteredRegions.length > 0 ? styles.hasList : ""
            }`}
          />
        </div>

        {/* 필터링된 지역 리스트 */}
        {region && filteredRegions.length > 0 && (
          <ul className={styles.filtered_region_list}>
            {filteredRegions.map((filteredRegion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleRegionSelect(
                    filteredRegion.city_province === filteredRegion.city_county
                      ? filteredRegion.city_province // 광역시는 중복 제거
                      : `${filteredRegion.city_province} - ${filteredRegion.city_county}`,
                    filteredRegion.x_position,
                    filteredRegion.y_position
                  )
                }
              >
                {filteredRegion.city_province === filteredRegion.city_county
                  ? filteredRegion.city_province
                  : `${filteredRegion.city_province} - ${filteredRegion.city_county}`}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 날짜 선택 */}
      <DateSelector
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        setStart_date={handleStart_date}
      />

      {/* 날씨 정보 */}
      <WeatherAlert
        selectedX={selectedX}
        selectedY={selectedY}
        start_date={start_date}
      />

      {/* 나이 선택 */}
      <div className={styles.travel_age_section}>
        <h2 className={styles.section_title}>3. 연령대</h2>
        <div className={styles.age_selection_container}>
          {ages.map((age) => (
            <button
              key={age}
              type="button"
              className={`${styles.age_button} ${
                selectedAge === age ? styles.active : ""
              }`}
              onClick={() => setSelectedAge(age)}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* 일행 선택 */}
      <div className={styles.travel_companions_section}>
        <h2 className={styles.section_title}>4. 일행</h2>
        <div className={styles.companions_selection_container}>
          {companions.map(({ label, count }, index) => (
            <div key={label} className={styles.companion_group}>
              <div className={styles.companion_controls}>
                <button
                  type="button"
                  className={styles.companion_minus}
                  onClick={() => handleCompanionChange(label, -1)}
                >
                  -
                </button>
                <span className={styles.companion_label}>{label}</span>
                <button
                  type="button"
                  className={styles.companion_plus}
                  onClick={() => handleCompanionChange(label, 1)}
                >
                  +
                </button>
                <p className={styles.companion_count}>
                  {label === "반려견" ? (
                    <>
                      총 <span className={styles.count_number}>{count}</span>
                      마리
                    </>
                  ) : index === 0 ? (
                    <>
                      (<span>본인</span> 포함) 총{" "}
                      <span className={styles.count_number}>{count}</span>명
                    </>
                  ) : (
                    <>
                      총 <span className={styles.count_number}>{count}</span>명
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 목적 선택 */}
      <div className={styles.travel_purpose_section}>
        <h2 className={styles.section_title}>5. 목적</h2>
        <div className={styles.purpose_selection_container}>
          {purposes.map((purpose) => (
            <button
              key={purpose}
              type="button"
              className={`${styles.purpose_button} ${
                selectedPurposes.includes(purpose) ? styles.active : ""
              }`}
              onClick={() => togglePurpose(purpose)}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className={styles.travel_plan_complete_button}>
        <LongBtn type="submit" content="완료" />
      </div>

      <div>
        <AlertModal
          isOpen={isOpen}
          content={message}
          onConfirm={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </form>
  );
};

export default PlanFilterSelector;
