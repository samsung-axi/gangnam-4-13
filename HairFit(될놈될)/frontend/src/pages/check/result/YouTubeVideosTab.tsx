import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Play, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../../../hooks/ImageWithFallback';
import LikeButton from '../../../components/LikeButton';

interface Video {
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
}

interface StageRecommendation {
  title: string;
  query: string;
  description: string;
}

interface YouTubeVideosTabProps {
  currentStage: number;
}

const YouTubeVideosTab: React.FC<YouTubeVideosTabProps> = ({ currentStage }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stageRecommendations: Record<number, StageRecommendation> = {
    0: {
      title: '정상 - 예방 및 두피 관리',
      query: '탈모 예방 두피 관리 샴푸',
      description: '건강한 두피를 유지하기 위한 예방법과 관리 방법'
    },
    1: {
      title: '초기 탈모 - 초기 증상 및 관리법',
      query: '탈모 초기 증상 치료 샴푸 영양제',
      description: '초기 탈모 단계에서의 적절한 대응 방법과 관리법'
    },
    2: {
      title: '중등도 탈모 - 약물 치료 및 전문 관리',
      query: '탈모 치료 미녹시딜 프로페시아 병원',
      description: '중등도 탈모에 효과적인 치료법과 전문의 상담'
    },
    3: {
      title: '심각한 탈모 - 모발이식 및 고급 시술',
      query: '모발이식 두피문신 SMP 병원 후기',
      description: '심각한 탈모 단계에서의 모발이식과 고급 치료법'
    }
  };

  // YouTube 영상 가져오기
  const fetchYouTubeVideos = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/ai/youtube/search?q=${encodeURIComponent(query)}&order=relevance&max_results=6`);
      const data = response.data;

      if (data.items && data.items.length > 0) {
        const videoList: Video[] = data.items.map((item: any) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelName: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.high.url
        }));
        setVideos(videoList);
      } else {
        throw new Error('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('YouTube API Error:', error);
      setError('YouTube 영상을 불러오는 중 오류가 발생했습니다.');

      // 더미 데이터로 대체
      const dummyVideos: Video[] = [
        {
          videoId: 'dummy1',
          title: '탈모 예방을 위한 올바른 샴푸 사용법',
          channelName: '헤어케어 전문가',
          thumbnailUrl: 'https://placehold.co/300x168/4F46E5/FFFFFF?text=탈모+예방+가이드'
        },
        {
          videoId: 'dummy2',
          title: '두피 마사지로 혈액순환 개선하기',
          channelName: '건강관리 채널',
          thumbnailUrl: 'https://placehold.co/300x168/059669/FFFFFF?text=두피+마사지'
        },
        {
          videoId: 'dummy3',
          title: '탈모에 좋은 음식 vs 나쁜 음식',
          channelName: '영양 정보',
          thumbnailUrl: 'https://placehold.co/300x168/DC2626/FFFFFF?text=탈모+영양관리'
        }
      ];
      setVideos(dummyVideos);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 현재 단계에 맞는 영상 로드
  useEffect(() => {
    const recommendation = stageRecommendations[currentStage];
    if (recommendation) {
      fetchYouTubeVideos(recommendation.query);
    }
  }, [currentStage, fetchYouTubeVideos]);

  return (
    <div className="space-y-4">
      {/* 단계별 추천 설명 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 {stageRecommendations[currentStage]?.description || "탈모 관리와 예방에 도움이 되는 영상을 추천합니다"}
        </p>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f0101]"></div>
          <span className="ml-3 text-gray-600 text-sm">맞춤 영상을 불러오는 중...</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">⚠️ {error}</p>
          <p className="text-xs text-red-600 mt-1">샘플 영상을 표시합니다.</p>
        </div>
      )}

      {/* 영상 목록 */}
      {!isLoading && videos.length > 0 && (
        <div className="space-y-3">
          {videos.slice(0, 4).map((video) => (
            <div key={video.videoId} className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* 썸네일 영역 */}
                  <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <ImageWithFallback
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/300x168/E8E8E8/424242?text=YouTube+Video';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* 영상 정보 영역 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">{video.title}</h4>
                      <LikeButton
                        type="youtube"
                        itemId={video.videoId}
                        itemName={video.title}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{video.channelName}</p>

                    <div className="bg-blue-50 p-2 rounded-lg text-xs mb-3">
                      🎯 {stageRecommendations[currentStage]?.title || '맞춤 추천'}
                    </div>

                    <button
                      onClick={() => {
                        const url = video.videoId.startsWith('dummy')
                          ? '#'  // 더미 데이터인 경우
                          : `https://www.youtube.com/watch?v=${video.videoId}`;
                        if (!video.videoId.startsWith('dummy')) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#1F0101] hover:bg-[#2A0202] text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 inline" />
                      시청하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 결과 없음 */}
      {!isLoading && videos.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📺</div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">영상이 없습니다</h3>
          <p className="text-xs text-gray-600">해당 단계의 영상이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideosTab;
