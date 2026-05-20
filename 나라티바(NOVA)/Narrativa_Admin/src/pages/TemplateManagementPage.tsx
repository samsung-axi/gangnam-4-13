import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { useToast } from '../hooks/useToast';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import PageLayout from '../components/ui/PageLayout';
import { RefreshCw } from 'lucide-react';
import ConfirmDialog from '../components/ui/ConfirmDialog';

interface TemplateDTO {
  id: number;
  genre: 'DEFAULT' | 'SURVIVAL' | 'ROMANCE';
  type: 'INITIAL' | 'CONTINUE' | 'RATE' | 'ENDING' | 'NPC' | 'ADVICE';
  content: string;
}

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const TemplateManagementPage = () => {
  const { getIdToken } = useAuth();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDTO | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<TemplateDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchGenre, setSearchGenre] = useState<string>('');
  const [newTemplate, setNewTemplate] = useState<Omit<TemplateDTO, 'id'>>({
    genre: 'DEFAULT',
    type: 'INITIAL',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const genres = ['DEFAULT', 'SURVIVAL', 'ROMANCE'];
  const types = ['INITIAL', 'CONTINUE', 'RATE', 'ENDING', 'NPC', 'ADVICE'];

  const formatForDisplay = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fetchTemplates = async () => {
    try {
      const token = await getIdToken();
      const response = await axios.get<TemplateDTO[]>(`${BASE_URL}/api/admin/templates`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('템플릿 목록 조회 실패:', error);
      showToast("템플릿 목록을 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async () => {
    try {
      const token = await getIdToken();
      const response = await axios.post<TemplateDTO>(
        `${BASE_URL}/api/admin/templates`, 
        newTemplate,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setTemplates([...templates, response.data]);
      setIsCreating(false);
      setNewTemplate({
        genre: 'DEFAULT',
        type: 'INITIAL',
        content: ''
      });
      showToast("새 템플릿이 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      showToast("템플릿 생성에 실패했습니다.", "error");
    }
  };

  const updateTemplate = async () => {
    if (editedTemplate && editedTemplate.id) {
      try {
        const token = await getIdToken();
        const response = await axios.put<TemplateDTO>(
          `${BASE_URL}/api/admin/templates/${editedTemplate.id}`, 
          editedTemplate,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        setTemplates(templates.map(template => 
          template.id === editedTemplate.id ? response.data : template
        ));
        setSelectedTemplate(response.data);
        setEditedTemplate(response.data);
        setIsEditing(false);
        showToast("템플릿이 성공적으로 수정되었습니다.", "success");
      } catch (error) {
        showToast("템플릿 수정에 실패했습니다.", "error");
      }
    }
  };

  const handleReFetch = async () => {
    setIsRefreshing(true);
    try {
      await fetchTemplates();
      setSearchGenre("");
      showToast("새로고침 완료", "success");
    } catch (error) {
      showToast("새로고침 실패", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTemplateClick = (template: TemplateDTO) => {
    if (selectedTemplate?.id === template.id) {
      setSelectedTemplate(null);
      setEditedTemplate(null);
      setIsEditing(false);
    } else {
      setSelectedTemplate(template);
      setEditedTemplate({...template});
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value;
    setSearchGenre(selectedGenre);
    setCurrentPage(1);
    setSelectedTemplate(null);
    setEditedTemplate(null);
    setIsEditing(false);
    
    try {
      const token = await getIdToken();
      const response = await axios.get<TemplateDTO[]>(
        `${BASE_URL}/api/admin/templates`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      // 클라이언트 사이드에서 장르 필터링
      const filteredTemplates = selectedGenre 
        ? response.data.filter(template => template.genre === selectedGenre)
        : response.data;
        
      setTemplates(filteredTemplates);
    } catch (error) {
      console.error('검색 실패:', error);
      showToast("검색에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(templates.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 타입별 색상 매핑 함수 추가
  const getTypeColor = (type: TemplateDTO['type']) => {
    const colors = {
      INITIAL: 'bg-blue-100 text-blue-800',
      CONTINUE: 'bg-green-100 text-green-800',
      RATE: 'bg-yellow-100 text-yellow-800',
      ENDING: 'bg-purple-100 text-purple-800',
      NPC: 'bg-pink-100 text-pink-800',
      ADVICE: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center p-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="Templates Management">
      <div className="h-[calc(100vh-120px)] w-full space-y-4 sm:space-y-6 p-2 sm:p-0 overflow-auto font-contents">
        {/* 검색 및 버튼 영역 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={searchGenre}
              onChange={handleGenreChange}
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-nanum"
            >
              <option value="">전체 장르</option>
              {genres.map(genre => (
                <option key={genre} value={genre} className="font-contents">
                  {formatForDisplay(genre)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleReFetch}
              disabled={isRefreshing}
              className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 bg-white hover:bg-gray-100 rounded-lg transition-all 
                hover:shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center border border-gray-200"
              aria-label="새로고침"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer text-white rounded-lg hover:bg-pointer2 transition-colors font-contents"
            >
              새 템플릿
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 템플릿 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-3 h-[300px] sm:h-[600px]">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800 font-title">템플릿 목록</h2>
              <div className="space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                {currentItems.length > 0 ? (
                  currentItems.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedTemplate?.id === template.id 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'hover:bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-extrabold sm:text-sm text-gray-600 font-contents">
                          {formatForDisplay(template.genre)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(template.type)}`}>
                          {formatForDisplay(template.type)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm sm:text-base text-gray-500 font-contents">
                      {searchGenre ? 
                        "검색 결과가 없습니다." : 
                        "등록된 템플릿이 없습니다."
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {currentItems.length > 0 && (
                <div className="flex justify-center items-center mt-2 sm:mt-4 space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 font-contents"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md ${
                        currentPage === number 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 font-contents"
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 템플릿 상세/수정/생성 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 h-[300px] sm:h-[600px] overflow-y-auto">
              {isCreating ? (
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">새 템플릿 작성</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        장르
                      </label>
                      <select
                        value={newTemplate.genre}
                        onChange={(e) => setNewTemplate(prev => ({
                          ...prev,
                          genre: e.target.value as TemplateDTO['genre']
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{formatForDisplay(genre)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        타입
                      </label>
                      <select
                        value={newTemplate.type}
                        onChange={(e) => setNewTemplate(prev => ({
                          ...prev,
                          type: e.target.value as TemplateDTO['type']
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {types.map(type => (
                          <option key={type} value={type}>{formatForDisplay(type)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        내용
                      </label>
                      <textarea
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate(prev => ({
                          ...prev,
                          content: e.target.value
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        style={{ minHeight: '250px', height: '250px' }}
                        placeholder="템플릿 내용을 입력하세요"
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-2 sm:mt-4">
                      <button 
                        onClick={() => setIsCreating(false)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-contents"
                      >
                        취소
                      </button>
                      <button 
                        onClick={createTemplate}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer2 text-white rounded-lg hover:bg-pointer transition-colors font-contents"
                      >
                        등록하기
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedTemplate ? (
                <div className="space-y-3 sm:space-y-4">
                  {isEditing ? (
                    // 수정 폼
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">템플릿 수정</h2>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            장르
                          </label>
                          <select
                            value={editedTemplate?.genre || ''}
                            onChange={(e) => setEditedTemplate(prev => prev ? {
                              ...prev,
                              genre: e.target.value as TemplateDTO['genre']
                            } : null)}
                            className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {genres.map(genre => (
                              <option key={genre} value={genre}>{formatForDisplay(genre)}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            타입
                          </label>
                          <select
                            value={editedTemplate?.type || ''}
                            onChange={(e) => setEditedTemplate(prev => prev ? {
                              ...prev,
                              type: e.target.value as TemplateDTO['type']
                            } : null)}
                            className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {types.map(type => (
                              <option key={type} value={type}>{formatForDisplay(type)}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            내용
                          </label>
                          <textarea
                            value={editedTemplate?.content || ''}
                            onChange={(e) => setEditedTemplate(prev => prev ? {
                              ...prev,
                              content: e.target.value
                            } : null)}
                            className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            style={{ minHeight: '250px', height: '250px' }}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-contents"
                          >
                            취소
                          </button>
                          <button 
                            onClick={updateTemplate}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer2 text-white rounded-lg hover:bg-pointer transition-colors font-contents"
                          >
                            저장하기
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 상세 보기
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">템플릿 상세</h2>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer2 text-white rounded-lg hover:bg-pointer transition-colors"
                          >
                            수정하기
                          </button>
                        </div>
                      </div>
                      <div className="border-b pb-3 sm:pb-4">
                        <p className="text-xs sm:text-sm text-gray-600 font-contents">
                          장르: {formatForDisplay(selectedTemplate.genre)} | 
                          타입: {formatForDisplay(selectedTemplate.type)}
                        </p>
                      </div>
                      <div className="py-2 sm:py-4">
                        <p className="text-sm sm:text-base whitespace-pre-wrap text-gray-700 font-contents">{selectedTemplate.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // 기본 빈 상태 메시지
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500 font-contents">
                    템플릿을 선택하거나 새로 작성해주세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* 로딩 오버레이 */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="p-4 rounded-lg shadow-lg">
            <LoadingAnimation />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default TemplateManagementPage;