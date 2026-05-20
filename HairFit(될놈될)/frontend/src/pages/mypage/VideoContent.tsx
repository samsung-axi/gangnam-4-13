import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../hooks/ImageWithFallback';

// TypeScript: VideoContent 컴포넌트 타입 정의
interface Video {
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnail: string;
  relevance: string;
}

interface VideoContentProps {
  videos: Video[];
}

const VideoContent: React.FC<VideoContentProps> = ({ videos }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">추천 영상 가이드</h3>
      <p className="text-sm text-gray-600 mb-4">
        전문가들이 추천하는 탈모 관리 영상들
      </p>
      
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-xl">
            <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200 relative">
              <ImageWithFallback 
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">{video.title}</h4>
            <p className="text-sm text-gray-600 mb-2">
              {video.channel} • {video.views}
            </p>
            
            <div className="bg-red-50 p-3 rounded-lg text-xs mb-3">
              🎯 {video.relevance}
            </div>
            
            <Button variant="outline" className="w-full h-10 rounded-lg active:scale-[0.98]">
              <ExternalLink className="w-4 h-4 mr-2" />
              시청하기
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoContent;
