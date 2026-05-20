import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, X } from 'lucide-react';
import { categories, articles } from '../../../utils/data/articles';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const mainDisplayCategories = [
    'types', 'causes', 'treatment', 'scalp-health',
    'prevention', 'diagnosis', 'myths', 'recommendations'
  ].map(id => categories.find(c => c.id === id)!).filter(Boolean);

  // 아티클 검색 로직
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // 실시간 검색이므로 검색어가 있으면 자동으로 검색 결과 표시
  const shouldShowSearch = searchQuery.trim().length > 0;

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Container - PC에서도 모바일 레이아웃 중앙 정렬 */}
      <div className="max-w-md mx-auto min-h-screen bg-white">
        {/* Main Content */}
        <main className="px-4 py-6">
          {/* 페이지 헤더 */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">탈모 지식백과</h2>
            <p className="text-sm text-gray-600">
              탈모에 대한 모든 것을 한 곳에서
            </p>
          </div>

          {/* 아티클 검색 섹션 */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="탈모 관련 아티클 검색..."
                className="w-full pl-10 pr-10 py-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#222222] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 검색 결과 또는 주요 카테고리 */}
          {shouldShowSearch ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  검색 결과 ({searchResults.length}개)
                </h3>
                <button
                  onClick={clearSearch}
                  className="flex items-center text-gray-600 hover:text-gray-900 text-xs"
                >
                  <X className="w-4 h-4 mr-1" />
                  취소
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      to={`/hair-encyclopedia/article/${article.id}`}
                      className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] touch-manipulation overflow-hidden block"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-6 h-6 ${article.category.color} rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0`}>
                            {article.category.icon}
                          </span>
                          <span className="text-xs text-gray-500">{article.category.name}</span>
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${
                            article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {article.difficulty === 'beginner' ? '초급' :
                             article.difficulty === 'intermediate' ? '중급' : '고급'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>📖 {article.readTime}분</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-3">🔍</div>
                  <p className="text-gray-600 text-sm mb-2 font-medium">
                    "{searchQuery}"에 대한 아티클을 찾을 수 없습니다
                  </p>
                  <p className="text-gray-500 text-xs mb-4">다른 키워드로 다시 검색해보세요</p>
                  <button
                    onClick={clearSearch}
                    className="text-[#222222] hover:text-gray-800 text-sm font-medium"
                  >
                    주요 카테고리 보기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">주요 카테고리</h3>
                <Link
                  to="/hair-encyclopedia/all-categories"
                  className="flex items-center text-[#222222] hover:text-gray-800 text-xs font-medium"
                >
                  전체보기
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {mainDisplayCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/hair-encyclopedia/category/${category.id}`}
                    className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] touch-manipulation overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-3`}>
                          <span className="text-white text-xl">{category.icon}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">{category.name}</h3>
                        <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                          <span>{category.subcategories.length}개 항목</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Spacing for Mobile Navigation */}
          <div className="h-20"></div>
        </main>
      </div>
    </div>
  );
};

// line-clamp 유틸리티 클래스를 위한 스타일
const styles = `
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
`;

// 스타일을 head에 추가
if (typeof document !== 'undefined' && !document.querySelector('#line-clamp-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'line-clamp-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default HomePage;