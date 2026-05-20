import React from 'react';
import type { NewsItem } from '@/features/report-generation/types/ReportTypes';

interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems }) => {
  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  // 뉴스 링크로 이동하는 함수
  const handleNewsClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 이미지 로딩 실패 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
  };

  return (
    <div className='mb-8 news-section avoid-break' data-section='news'>
      <h3 className='font-bold mb-4 text-gray-800 pb-2'>[관련 최신 기사]</h3>

      {/* 일반 화면에서만 보이는 뉴스 카드 (PDF에서는 제외됨) */}
      <div className='grid grid-cols-1 gap-4 no-print'>
        {newsItems.map((news, index) => (
          <div
            key={`web-${index}`}
            className='bg-white rounded-lg shadow p-4 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer'
            onClick={() => handleNewsClick(news.url)}
          >
            <div className='flex'>
              {news.image_url && (
                <div className='flex-shrink-0 mr-4'>
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className='w-16 h-16 object-cover rounded'
                    onError={handleImageError}
                  />
                </div>
              )}
              <div className='flex-grow'>
                <h4 className='text-lg font-semibold mb-1 text-blue-600 hover:underline'>
                  {news.title}
                </h4>
                {news.source && news.published_date && (
                  <div className='text-xs text-gray-500 mb-2'>
                    {news.source} · {news.published_date}
                  </div>
                )}
                {news.summary && <p className='text-sm text-gray-700'>{news.summary}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF에서 보이는 뉴스 리스트 (일반 화면에서는 숨김) */}
      <div className='print-only news-container'>
        {newsItems.map((news, index) => (
          <div className='news-item-upper'>
            <div key={`pdf-${index}`} className='news-item'>
              <div className='news-title'>{news.title}</div>
              <div className='news-url'>URL: {news.url}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
