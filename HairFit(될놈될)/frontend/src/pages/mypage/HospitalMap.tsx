import React, { useState } from 'react';
import { MapPin, Star, Phone, Navigation } from 'lucide-react';

// TypeScript: HospitalMap 컴포넌트 타입 정의
interface Hospital {
  name: string;
  specialty: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  phone: string;
  image: string;
  matchReason: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface HospitalMapProps {
  hospitals: Hospital[];
}

const HospitalMap: React.FC<HospitalMapProps> = ({ hospitals }) => {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const regions = ['서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산'];
  const categories = ['전체', '탈모병원', '탈모클리닉', '모발이식', '가발'];

  // 카테고리별 병원 필터링
  const filteredHospitals = selectedCategory === '전체' 
    ? hospitals 
    : hospitals.filter(hospital => hospital.category === selectedCategory);

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join('');
  };

  // 카테고리별 그룹화
  const groupedHospitals = filteredHospitals.reduce((groups, hospital) => {
    const category = hospital.category || '기타';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(hospital);
    return groups;
  }, {} as Record<string, Hospital[]>);

  // 그룹 순서 정의
  const groupOrder = ['탈모병원', '탈모클리닉', '모발이식', '가발', '기타'];

  // 그룹별 섹션 생성
  const sections = groupOrder
    .filter(group => groupedHospitals[group] && groupedHospitals[group].length > 0)
    .map(group => ({
      group,
      items: groupedHospitals[group]
    }));

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">내가 찜한 탈모 맵</h1>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1F0101] focus:border-transparent"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1F0101] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.group} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleGroup(section.group)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {section.group === '탈모병원' && '🏥'}
                      {section.group === '탈모클리닉' && '🏥'}
                      {section.group === '모발이식' && '💉'}
                      {section.group === '가발' && '🎭'}
                      {section.group === '기타' && '🏢'}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">{section.group}</h2>
                  </div>
                  <span className="text-sm text-gray-500">{section.items.length}개</span>
                </div>
                {!collapsedGroups[section.group] && (
                  <div className="space-y-2 p-6">
                    {section.items.map((hospital, index) => (
                      <div key={index} className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* 헤더: 병원명만 */}
                            <div className="mb-2">
                              <h3 className="text-base font-semibold text-gray-900">{hospital.name}</h3>
                            </div>

                            <div className="space-y-1 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{hospital.address || hospital.distance}</span>
                              </div>
                              
                              {hospital.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span>{hospital.phone}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{hospital.distance}</span>
                              </div>
                            </div>

                            {hospital.specialty && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span className="px-2 py-1 bg-[#1F0101]/10 text-[#1F0101] text-xs rounded-full">
                                  {hospital.specialty}
                                </span>
                              </div>
                            )}

                            {hospital.matchReason && (
                              <p className="text-xs text-gray-500 mb-2">{hospital.matchReason}</p>
                            )}
                          </div>

                          {/* 오른쪽: 별점 + 버튼들 */}
                          <div className="ml-4 flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400">{renderStars(hospital.rating)}</span>
                              <span className="text-sm text-gray-600">({hospital.rating.toFixed(1)})</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (hospital.latitude && hospital.longitude) {
                                    const url = `https://map.kakao.com/link/map/${hospital.name},${hospital.latitude},${hospital.longitude}`;
                                    window.open(url, '_blank');
                                  }
                                }}
                                className="px-3 py-1 bg-[#1F0101] hover:bg-[#2A0202] text-white text-xs font-medium rounded transition-colors"
                              >
                                <Navigation className="w-3 h-3 inline mr-1" />
                                지도보기
                              </button>
                              <button
                                onClick={() => {
                                  if (hospital.phone) {
                                    window.location.href = `tel:${hospital.phone}`;
                                  }
                                }}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors"
                              >
                                <Phone className="w-3 h-3 inline mr-1" />
                                전화
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {sections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">찜한 병원이 없습니다</h3>
            <p className="text-gray-600">병원을 검색하고 찜해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalMap;
