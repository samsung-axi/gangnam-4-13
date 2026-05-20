import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../css/linkpage/TravelInfo/TravelInfo.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import planeIcon from '../../../images/Plane.svg';
import selectIcon from '../../../images/select.svg';
import isSelectedIcon from '../../../images/isselect.svg';
import backArrowIcon from '../../../images/backArrow.svg';
import TitleEditModal from './TitleEditModal';
import SelectModal from './SelectModal';
import aiIcon from '../../../images/chatbot.gif';
import { GoogleMap } from '@react-google-maps/api';
import axiosInstance from '../../../components/AxiosInstance';
import Loading from '../../../components/Loading/Loading';

// 구글 맵 컴포넌트(경로)
const MapComponent = React.memo(({ places }) => {
  if (!places) return null;

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  // places가 배열인 경우와 단일 객체인 경우 처리
  const isArray = Array.isArray(places);

  const center = isArray ? {
    lat: parseFloat(places[0].latitude),
    lng: parseFloat(places[0].longitude)
  } : {
    lat: parseFloat(places.latitude),
    lng: parseFloat(places.longitude)
  };

  const onLoad = (map) => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    try {
      // bounds 객체 생성            
      const bounds = new window.google.maps.LatLngBounds();


      // 마커 생성 전에 좌표 유효성 로깅
      places.forEach((place, index) => {
        const lat = parseFloat(place.latitude);
        const lng = parseFloat(place.longitude);

        // 좌표 유효성 검사
        if (isNaN(lat) || isNaN(lng)) {
          console.error(`Invalid coordinates for place ${place.name}:`, {
            lat: place.latitude,
            lng: place.longitude
          });
          return;
        }

        const position = {
          lat: lat,
          lng: lng
        };

        try {
          // bounds에 위치 추가 전에 로깅
          bounds.extend(position);

          // 마커 생성
          const markerView = new window.google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: place.name,
            content: new window.google.maps.marker.PinElement({
              // glyph: `${index + 1}`,  // place.num 대신 index + 1 사용
              glyphColor: '#FFFFFF',
              background: '#4285f4',
              borderColor: '#4285f4'
            }).element
          });

          // InfoWindow 설정
          markerView.addListener('click', () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                                  <div style="padding: 10px;">
                                      <img src="${place.placeImage}" alt="장소 이미지" style="width: 100%; height: 100px; object-fit: cover;">
                                      <p>${place.placeAddress || ''}</p>
                                      <p>${place.intro || ''}</p>
                                  </div>
                              `
            });
            infoWindow.open(map, markerView);
          });
        } catch (markerError) {
          console.error(`Error creating marker for ${place.name}:`, markerError);
        }
      });

      // 지도 범위 조정
      map.fitBounds(bounds);

      // 줌 레벨 조정
      const listener = map.addListener('idle', () => {
        const currentZoom = map.getZoom();
        if (currentZoom > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });

    } catch (error) {
      console.error('Error in onLoad:', error);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        mapId: process.env.REACT_APP_GOOGLE_MAPS_ID
      }}
    >
    </GoogleMap>
  );
}, (prevProps, nextProps) => {
  // places 배열의 실제 내용이 변경되었을 때만 리렌더링
  return JSON.stringify(prevProps.places) === JSON.stringify(nextProps.places);
});

// 장소 타입 분류 상수 정의
const PLACE_TYPE_CATEGORIES = {
  landmark: [
    'tourist_attraction',
    'museum',
    'art_gallery',
    'aquarium',
    'amusement_park',
    'zoo',
    'stadium',
    'park',
    'landmark',
    'natural_feature',
    'place_of_worship',
    'church',
    'mosque',
    'temple',
    'synagogue',
    'hindu_temple',
    'point_of_interest',
    'campground',
    'rv_park'
  ],
  restaurant: [
    'restaurant',
    'cafe',
    'bakery',
    'bar',
    'meal_delivery',
    'meal_takeaway',
    'food',
    'night_club'
  ]
  // etc는 위의 두 카테고리에 포함되지 않는 모든 타입
};

const TravelInfo = () => {

  const [placeType, setPlaceType] = useState("landmark");
  const [activeSpan, setActiveSpan] = useState(1);
  const [travelDays, setTravelDays] = useState();
  const [travelInfoTitle, setTravelInfoTitle] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { travelInfoId } = useParams();
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const navigate = useNavigate();

  const [travelInfo, setTravelInfo] = useState({
    message: '',
    success: '',
    travelDays: 0,
    travelInfoId: '',
    travelInfoTitle: '',
    urlCnt: 0,
    urlList: [
      {
        author: '',
        title: '',
        urlAddress: '',
        urlId: ''
      }
    ]
  });

  const [placeList, setPlaceList] = useState({
    success: '',
    message: '',
    content: [
      {
        urlId: '',
        placeId: '',
        placeType: '',
        placeName: '',
        placeAddress: '',
        placeImage: '',
        placeDescription: '',
        intro: '',
        latitude: '',
        longitude: ''
      }
    ]
  });


  const [allPlaceList, setAllPlaceList] = useState({
    success: '',
    message: '',
    content: [
      {
        urlId: '',
        placeId: '',
        placeType: '',
        placeName: '',
        placeAddress: '',
        placeImage: '',
        placeDescription: '',
        intro: '',
        latitude: '',
        longitude: ''
      }
    ]
  });

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedAIPlaces, setSelectedAIPlaces] = useState([]);



  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showNoData, setShowNoData] = useState(false);

  const [timer, setTimer] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderReady, setSliderReady] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 전체선택 상태를 추가
  const [isAllSelected, setIsAllSelected] = useState(false);

  const handleSelectAll = () => {
    if (isAllSelected) {
      // 전체 해제
      setSelectedPlaces([]);
      setIsAllSelected(false);
    } else {
      // 전체 선택
      setSelectedPlaces(placeList.content);
      setIsAllSelected(true);
    }
  };

  const getTravelInfo = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTravelInfo(response.data);
        setTravelDays(response.data.travelDays);
        setTravelInfoTitle(response.data.travelInfoTitle);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId]);

  const getPlaceList = useCallback(async () => {
    try {
      if (token) {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}/places`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlaceList(response.data);
        setAllPlaceList(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId]);

  const getUrlPlaceList = useCallback(async (urlId) => {
    try {
      if (token) {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/api/v1/travels/travelInfos/urls/${urlId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlaceList(response.data);
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const putTravelInfoUpdate = useCallback(async (days, title) => {
    try {
      if (token) {
        // 값 유효성 검사
        if (!title || !days) {
          console.error('필수 값이 누락되었습니다:', { title, days });
          return;
        }


        await axiosInstance.put(
          `/api/v1/travels/travelInfos/${travelInfoId}`,
          {
            travelInfoTitle: title,
            travelDays: parseInt(days) // 숫자로 변환
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        console.error('토큰이 없습니다.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId, travelInfoTitle, travelDays]); // 의존성 배열에 필요한 값들 추가

  const getAISelect = useCallback(async () => {
    try {
      if (!token) {
        throw new Error('토큰이 없습니다');
      }

      if (selectedAIPlaces.length === 0 || selectedAIPlaces.length !== selectedPlaces.length) {
        setLoading(true);
        setError(null);

        // 토큰 유효성 확인
        if (!localStorage.getItem('token')) {
          throw new Error('토큰이 만료되었습니다');
        }

        const response = await axiosInstance.get(`/api/v1/travels/travelInfos/${travelInfoId}/aiSelect`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // 응답 데이터 유효성 검사 추가
        if (!response.data || !response.data.content) {
          throw new Error('유효하지 않은 응답 데이터입니다');
        }

        if (response.data.success === "success") {
          for (let place of response.data.content) {
            const findPlace = allPlaceList.content.find(item => item.placeId === place.placeId);
            if (!findPlace) {
              console.warn(`Place not found: ${place.placeId}`);
              continue;
            }
            setSelectedPlaces(prev => [...prev, findPlace]);
            setSelectedAIPlaces(prev => [...prev, findPlace]);
          }
        }
      } else {
        setSelectedPlaces(selectedAIPlaces);
      }
    } catch (error) {
      console.error('AI 선택 중 오류 발생:', error);
      setError(error.message || 'AI 선택 중 오류가 발생했습니다');
      // 사용자에게 오류 메시지 표시
      alert('AI 선택 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [travelInfoId, selectedAIPlaces, selectedPlaces.length, allPlaceList, token]);

  // ============================================================================================

  useEffect(() => {
    setIsComponentMounted(true);

    if (!token) {
      setToken(localStorage.getItem('token'));
      if (!token) {
        navigate('/login');
      } 
    } 
  }, []);

  useEffect(() => {
    if (travelInfoId) {
      getTravelInfo();
      getPlaceList();
    }
  }, [travelInfoId, getTravelInfo, getPlaceList]);

  useEffect(() => {
    const timers = [];

    if (loading && !showLoading) {
      timers.push(setTimeout(() => setShowLoading(true), 2000));
    } else {
      setShowLoading(false);
    }

    if (error) {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setShowError(true);
      }, 4000);
      setTimer(newTimer);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      setShowError(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [error]);

  useEffect(() => {
    if (isComponentMounted) {
      const timer = setTimeout(() => {
        setSliderReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isComponentMounted]);

  useEffect(() => {
    console.log("selectedPlaces 변경됨:", selectedPlaces);
  }, [selectedPlaces]);

  useEffect(() => {
    console.log("selectedAIPlaces 변경됨:", selectedAIPlaces);
  }, [selectedAIPlaces]);

  if (showLoading) return <Loading type="travelInfo" />;
  if (showError) return <div>에러: {error}</div>;
  if (showNoData) return <div>데이터가 없습니다.</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    lazyLoad: true,
    fade: false,
    swipeToSlide: currentSlide !== 2,  // 세 번째 슬라이드에서는 스와이프 비활성화
    adaptiveHeight: true,
    initialSlide: 0,
    waitForAnimate: true,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    swipe: currentSlide !== 2,  // 세 번째 슬라이드에서는 스와이프 비활성화
    touchThreshold: currentSlide === 2 ? 10 : 3,  // 세 번째 슬라이드에서는 터치 감도를 매우 낮게 설정
    useCSS: true,
    useTransform: true
  };

  const handleSpanClick = (num) => {
    if (num === 1) {
      setPlaceList(allPlaceList);
    } else {
      getUrlPlaceList(travelInfo.urlList[num - 2].urlId);
    }
    setActiveSpan(num);

  };

  const handlePlaceClick = (place) => {
    setSelectedPlaces(prev => {
      // placeId를 기준으로 객체가 이미 존재하는지 확인
      const isExist = prev.some(item => item.placeId === place.placeId);

      if (isExist) {
        return prev.filter(item => item.placeId !== place.placeId);
      }
      return [...prev, place];
    });
  };


  const handleAISelected = async () => {
    try {
      setShowLoading(true);
      console.log("이전 선택된 장소들:", selectedPlaces);

      // 이전 상태와 관계없이 빈 배열로 초기화
      setSelectedPlaces(prevPlaces => {
        console.log("이전 places:", prevPlaces);
        return [];
      });

      setSelectedAIPlaces(prevAIPlaces => {
        console.log("이전 AI places:", prevAIPlaces);
        return [];
      });
      // AI 선택 관련 기능 실행
      await getAISelect();

    } catch (error) {
      console.error('AI 선택 중 오류 발생:', error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleTitleEdit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSelectModalClose = () => {
    setIsSelectModalOpen(false);
  };

  const handlePlaceDelete = (placeList) => {
    // setSelectedPlaces state 초기화 후 placeList 추가
    setSelectedPlaces([]);
    setSelectedPlaces(placeList);
  };

  const handleTitleSave = ({ days, title }) => {
    // 여기에 제목 저장 로직 추가
    setTravelDays(days);
    setTravelInfoTitle(title);
    setIsModalOpen(false);
    putTravelInfoUpdate(days, title);
  };

  const handleSelectBtn = () => {
    setIsSelectModalOpen(true);
  };

  // 장소 타입 체크 함수
  const checkPlaceType = (itemType) => {
    if (PLACE_TYPE_CATEGORIES.landmark.includes(itemType)) return 'landmark';
    if (PLACE_TYPE_CATEGORIES.restaurant.includes(itemType)) return 'restaurant';
    return 'etc';
  };

  // 이미지 URL이 유효한지 검사하는 함수
  const isValidUrl = (url) => {
    if (!url) {
      console.log('이미지 URL이 없음');
      return false;
    }
    if (typeof url !== 'string') {
      console.log('이미지 URL이 문자열이 아님');
      return false;
    }

    // PlacePhoto 형식 확인 및 URL 추출
    if (url.startsWith('[PlacePhoto(') && url.endsWith(')]')) {
      const match = url.match(/url=([^)]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }

    // 일반 URL 확인
    if (url.startsWith('https://')) {
      return url;
    }

    return false;
  };

  return (
    <div className="HG-TravelInfo-Wrapper">
      <main className='HG-TravelInfo-Container'>
        <div className='HG-TravelInfo-Header'>
          <div className='WS-TravelInfo-Header-Left'>
            <div className='WS-TravelInfo-Header-Left-Back-Btn'>
              <img className='WS-TravelInfo-Header-Left-Back-Btn-Icon'
                src={backArrowIcon}
                alt="backArrowIcon"
                onClick={() => navigate(-1)} />
            </div>

            <div className='WS-TravelInfo-Header-Left-Contents'>
              <div className='WS-TravelInfo-Travel-Days'>{travelDays}일</div>

              <div className='HG-TravelInfo-Title-Edit-Container'>
                <div className='HG-TravelInfo-Title'>{travelInfoTitle}</div>
                <span className='HG-TravelInfo-Title-Edit-text'
                  onClick={handleTitleEdit}
                >편집</span>
              </div>
            </div>
          </div>

          <div className='WS-TravelInfo-Header-Right' onClick={handleSelectBtn}>
            <span className='HG-TravelInfo-Select-Btn'>선택 </span>
            <img src={planeIcon} alt="selectIcon" /> {/* FEAT: 선택 버튼 선택 여행지 모달 팝업 */}
            <span className='HG-TravelInfo-Select-Cnt'>{selectedPlaces.length}</span> {/* DATA: 선택 여행지 갯수 카운트 */}
          </div>
        </div>

        <div className='HG-TravelInfo-Body'>
          <div className='HG-travelinfo-Title-list'>
            <span className={`HG-travelinfo-content-frame-url ${activeSpan === 1 ? 'HG-underline' : ''}`} onClick={() => handleSpanClick(1)}>
              전체보기
            </span>
            {travelInfo.urlList.map((item, index) => (
              item.urlAddress.includes("youtube") ?
                <span
                  className={`HG-travelinfo-content-frame-url ${activeSpan === `${index + 2}` ? 'HG-underline' : ''}`}
                  key={index}
                  onClick={() => handleSpanClick(`${index + 2}`)}
                >
                  영상{index + 1}
                </span>
                :
                <span
                  className={`HG-travelinfo-content-frame-url ${activeSpan === `${index + 2}` ? 'HG-underline' : ''}`}
                  key={index}
                  onClick={() => handleSpanClick(`${index + 2}`)}
                >
                  블로그{index + 1}
                </span>
            ))}
          </div>

          <div className={` ${activeSpan === 1 ? 'HG-TravelInfo-Content-Blank' : 'HG-TravelInfo-Content-Title'}`}>
            {(() => {
              try {
                if (activeSpan === 1) {
                  return '';
                }

                const index = activeSpan - 2;
                if (index < 0 || index >= travelInfo.urlList.length) {
                  return '제목을 찾을 수 없습니다'; // 기본값 설정
                }

                return travelInfo.urlList[index].title;
              } catch (error) {
                console.error('제목 표시 중 오류 발생:', error);
                return '제목을 불러오는 중 오류가 발생했습니다';
              }
            })()}
          </div>

          <div className='HG-TravelInfo-Type-List'>
            <span
              className={`${placeType === "landmark" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
              onClick={() => setPlaceType("landmark")}
            >
              관광지
            </span>
            <span
              className={`${placeType === "restaurant" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
              onClick={() => setPlaceType("restaurant")}
            >
              맛집
            </span>
            <span className={`${placeType !== "landmark" && placeType !== "restaurant" ? 'HG-TravelInfo-Selected-Type' : 'HG-TravelInfo-Unselected-Type'}`}
              onClick={() => setPlaceType("etc")}>
              그 외
            </span>
          </div>
          <div className='WS-TravelInfo-aiselect-btn-Container'>
            <span className={`HG-TravelInfo-aiselect-btn-ai-icon-selected`}
              onClick={handleAISelected}>
              <img className={`HG-TravelInfo-aiselect-btn-ai-icon`}
                src={aiIcon} alt="aiIcon" />
              AI 추천선택</span>

            <span className='WS-TravelInfo-btn-select-all' onClick={handleSelectAll}>
              {isAllSelected ? '전체 해제' : '전체 선택'}
            </span>
          </div>

          {selectedPlaces.length > 0 && (
            <div className="WS-TravelInfo-btn-select-text-Container">
              <div className="WS-TravelInfo-btn-select-text-bold">
                {travelDays}일 기준:
              </div>
              <div className="WS-TravelInfo-btn-select-text">
                최소 {travelDays * 2}개 - 최대 {travelDays * 5}개 가능
              </div>
            </div>
          )}

          <div className='HG-TravelInfo-Content-Frame-Place-Slider'>
            {placeList.content.map((item, index) => {
              const itemCategory = checkPlaceType(item.placeType);
              const shouldShow =
                (placeType === itemCategory) ||
                (placeType === 'etc' && itemCategory === 'etc');

              return shouldShow ? (
                <div key={index} className={`WS-carousel-item ${selectedPlaces.some(selected => selected.placeId === item.placeId) ? 'HG-select-place' : ''}`}>
                  <div className='HG-trevelinfo-select-Container' onClick={() => handlePlaceClick(item)}>
                    <img
                      className='HG-trevelinfo-content-frame-select'
                      src={`${selectedPlaces.some(selected => selected.placeId === item.placeId) ? isSelectedIcon : selectIcon}`}
                      alt="selectIcon"
                    />
                    <span className='HG-trevelinfo-content-frame-select-name'>{item.placeName}</span>
                    <span className='HG-trevelinfo-content-frame-select-intro'>{item.intro}</span>
                  </div>

                  <Slider {...sliderSettings}>
                    {/* 첫 번째 슬라이드 */}
                    <div className="slide-content">
                      <img
                        className="HG-slide-content-image"
                        src={(() => {
                          try {
                            const validUrl = isValidUrl(item.placeImage);
                            if (validUrl) {
                              return validUrl;
                            }
                            return 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3';
                          } catch (error) {
                            console.log('이미지 처리 중 오류 발생:', {
                              error: error.message,
                              stack: error.stack,
                              data: item.placeImage,
                              place: item.placeName
                            });
                            return 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3';
                          }
                        })()}
                        onError={(e) => {
                          console.log('이미지 로드 실패:', {
                            place: item.placeName,
                            src: e.target.src,
                            originalImage: item.placeImage
                          });
                          e.target.onerror = null; // 무한 루프 방지
                          e.target.src = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3';
                        }}
                        alt={item.placeName || '장소 이미지'}
                      />
                    </div>

                    {/* 두 번째 슬라이드 */}
                    <div className="slide-content">
                      <div className='WS-TravelInfo-Description'>{item.placeDescription}</div>
                      <div className='WS-TravelInfo-Address'>{item.placeAddress}</div>
                    </div>

                    {/* 세 번째 슬라이드 */}
                    <div className="slide-content" key={`map-${index}`}>
                      {item?.latitude && item?.longitude && (
                        <MapComponent
                          key={`map-${index}`}
                          places={[item]} />
                      )}
                    </div>
                  </Slider>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <TitleEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          travelDays={travelDays}
          travelInfoTitle={travelInfoTitle}
          onSave={handleTitleSave}
        />
        <div className={`${isSelectModalOpen ? 'HG-TravelInfo-Select-Modal' : 'none'}`}>
          <SelectModal
            isOpen={isSelectModalOpen}
            onClose={handleSelectModalClose}
            selectedPlaces={selectedPlaces}
            onPlaceSelect={handlePlaceDelete}
            travelDays={travelDays}
            travelInfoId={travelInfoId}
          />
        </div>
      </main>
    </div>
  );
};
export default TravelInfo; 