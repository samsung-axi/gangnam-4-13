import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { useToast } from '../hooks/useToast';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import PageLayout from '../components/ui/PageLayout';
import { RefreshCw } from 'lucide-react';
import ConfirmDialog from '../components/ui/ConfirmDialog';

interface PromptDTO {
  id: number;
  genre: 'Mystery' | 'Survival' | 'Romance' | 'Simulation';
  title: string; 
  content: string;
  active: boolean;
}

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const PromptManagementPage = () => {
  const { getIdToken } = useAuth();
  const { showToast } = useToast();
  const [prompts, setPrompts] = useState<PromptDTO[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptDTO | null>(null);
  const [editedPrompt, setEditedPrompt] = useState<PromptDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchGenre, setSearchGenre] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<Omit<PromptDTO, 'id'>>({
    title: '',
    genre: 'Mystery',
    content: '',
    active: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const genres = ['Mystery', 'Survival', 'Romance', 'Simulation'];

  const formatGenreForDisplay = (genre: string) => {
    return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
  };

  const fetchPrompts = async (fetchAll: boolean = false) => {
    try {
      const token = await getIdToken();
      const endpoint = fetchAll || showInactive 
        ? `${BASE_URL}/api/admin/prompts/all`
        : `${BASE_URL}/api/admin/prompts`;
      
      const response = await axios.get<PromptDTO[]>(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setPrompts(response.data);
    } catch (error) {
      console.error('프롬프트 목록 조회 실패:', error);
      showToast("프롬프트 목록을 불러오는데 실패했습니다.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const createPrompt = async (promptData: Omit<PromptDTO, 'id'>) => {
    try {
      const token = await getIdToken();
      const response = await axios.post<PromptDTO>(`${BASE_URL}/api/admin/prompts`, promptData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setPrompts([...prompts, response.data]);
    } catch (error) {
      console.error('프롬프트 생성 실패:', error);
    }
  };

  const updatePrompt = async (id: number, promptData: PromptDTO) => {
    try {
      const token = await getIdToken();
      const response = await axios.put<PromptDTO>(`${BASE_URL}/api/admin/prompts/${id}`, promptData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setPrompts(prompts.map(prompt => 
        prompt.id === id ? response.data : prompt
      ));
    } catch (error) {
      console.error('프롬프트 수정 실패:', error);
    }
  };

  const searchPromptsByGenre = async () => {
    setCurrentPage(1);
    try {
      const token = await getIdToken();
      const response = await axios.get<PromptDTO[]>(`${BASE_URL}/api/admin/prompts/search?genre=${searchGenre}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setPrompts(response.data);
    } catch (error) {
      console.error('프롬프트 검색 실패:', error);
    }
  };

  const togglePromptStatus = async (id: number) => {
    try {
      const token = await getIdToken();
      await axios.put<PromptDTO>(
        `${BASE_URL}/api/admin/prompts/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      // 상태 초기화
      setSelectedPrompt(null);
      setEditedPrompt(null);
      setIsEditing(false);
      
      await fetchPrompts(true);
      showToast("프롬프트 상태가 변경되었습니다.", "success");
    } catch (error) {
      showToast("상태 변경에 실패했습니다.", "error");
    }
  };

  const handleEdit = async () => {
    if (editedPrompt && editedPrompt.id) {
      try {
        const token = await getIdToken();
        const response = await axios.put<PromptDTO>(
          `${BASE_URL}/api/admin/prompts/${editedPrompt.id}`, 
          editedPrompt, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        
        // 목록 업데이트
        setPrompts(prompts.map(prompt => 
          prompt.id === editedPrompt.id ? response.data : prompt
        ));
        
        // 상세보기 업데이트
        setSelectedPrompt(response.data);
        setEditedPrompt(response.data);
        setIsEditing(false);
        
        showToast("프롬프트가 성공적으로 수정되었습니다.", "success");
      } catch (error) {
        showToast("프롬프트 수정에 실패했습니다.", "error");
      }
    }
  };

  const handleCreate = async () => {
    try {
      await createPrompt(newPrompt);
      setIsCreating(false);
      setNewPrompt({
        title: '',
        genre: 'Mystery',
        content: '',
        active: true
      });
      await fetchPrompts();
      showToast("새 프롬프트가 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      showToast("프롬프트 생성에 실패했습니다.", "error");
    }
  };

  const handleReFetch = async () => {
    setIsRefreshing(true);
    try {
      await fetchPrompts();
      setSearchGenre("");
      showToast("새로고침 완료", "success");
    } catch (error) {
      showToast("새로고침 실패", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePromptClick = (prompt: PromptDTO) => {
    if (selectedPrompt?.id === prompt.id) {
      setSelectedPrompt(null);
      setEditedPrompt(null);
      setIsEditing(false);
    } else {
      setSelectedPrompt(prompt);
      setEditedPrompt({...prompt});
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const handleStatusToggle = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: '상태 변경 확인',
      message: '이 프롬프트의 상태를 변경하시겠습니까?',
      onConfirm: async () => {
        try {
          await togglePromptStatus(id);
          setSelectedPrompt(null);
          setEditedPrompt(null);
          setIsEditing(false);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          showToast("상태 변경에 실패했습니다.", "error");
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleShowInactiveChange = async (checked: boolean) => {
    setCurrentPage(1);
    setShowInactive(checked);
    await fetchPrompts(checked);
  };

  const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value;
    setSearchGenre(selectedGenre);
    setCurrentPage(1);
    setSelectedPrompt(null);
    setEditedPrompt(null);
    setIsEditing(false);
    
    try {
      const token = await getIdToken();
      let endpoint = `${BASE_URL}/api/admin/prompts`;
      
      if (selectedGenre) {
        endpoint = `${BASE_URL}/api/admin/prompts/search?genre=${selectedGenre}`;
      }
      
      if (showInactive) {
        endpoint = selectedGenre 
          ? `${BASE_URL}/api/admin/prompts/search?genre=${selectedGenre}&includeInactive=true`
          : `${BASE_URL}/api/admin/prompts/all`;
      }
      
      const response = await axios.get<PromptDTO[]>(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setPrompts(response.data);
    } catch (error) {
      console.error('검색 실패:', error);
      showToast("검색에 실패했습니다.", "error");
    }
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
    setSelectedPrompt(null);
    setEditedPrompt(null);
    setIsEditing(false);
    
    // 현재 프롬프트 목록에서 텍스트 필터링
    const filteredData = prompts.filter(prompt => 
      prompt.title.toLowerCase().includes(newSearchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(newSearchQuery.toLowerCase())
    );
    setPrompts(filteredData);
  };

  useEffect(() => {
    const loadPrompts = async () => {
      if (searchGenre) {
        await handleGenreChange({ target: { value: searchGenre } } as React.ChangeEvent<HTMLSelectElement>);
      } else {
        await fetchPrompts(showInactive);
      }
    };
    
    loadPrompts();
  }, [showInactive]);

  const filteredPrompts = prompts.filter(prompt => 
    (showInactive || prompt.active)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrompts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center p-4">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="Prompts Management">
      <div className="h-[calc(100vh-120px)] w-full space-y-4 sm:space-y-6 p-2 sm:p-0 overflow-auto font-nanum">
        {/* 검색 및 버튼 영역 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={searchGenre}
              onChange={handleGenreChange}
              className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-contents"
            >
              <option value="">전체 장르</option>
              {genres.map(genre => (
                <option key={genre} value={genre} className="font-nanum">
                  {genre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => handleShowInactiveChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showInactive" className="text-xs sm:text-sm text-gray-600 font-contents">
                비활성 프롬프트 포함
              </label>
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
                className="w-full sm:w-auto px-3 py-1.5 font-contents sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer text-white rounded-lg hover:bg-pointer2 transition-colors"
              >
                새 프롬프트
              </button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* 프롬프트 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 h-[300px] sm:h-[600px]">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 text-gray-800 font-title">프롬프트 목록</h2>
              <div className="space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                {currentItems.length > 0 ? (
                  currentItems.map((prompt) => (
                    <div 
                      key={prompt.id}
                      onClick={() => handlePromptClick(prompt)}
                      className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedPrompt?.id === prompt.id 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'hover:bg-gray-50 border-gray-200'}
                        ${!prompt.active && 'opacity-75'}`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 font-contents">{prompt.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          prompt.active 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {prompt.active ? '활성' : '비활성'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-contents mt-1">장르: {prompt.genre}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm sm:text-base text-gray-500 font-contents">
                      {searchGenre ? 
                        "검색 결과가 없습니다." : 
                        "등록된 프롬프트가 없습니다."
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

          {/* 프롬프트 상세/수정/생성 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 h-[300px] sm:h-[600px] overflow-y-auto">
              {isCreating ? (
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">새 프롬프트 작성</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        제목
                      </label>
                      <input
                        type="text"
                        value={newPrompt.title}
                        onChange={(e) => setNewPrompt(prev => ({
                          ...prev,
                          title: e.target.value
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="프롬프트 제목을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        장르
                      </label>
                      <select
                        value={newPrompt.genre}
                        onChange={(e) => setNewPrompt(prev => ({
                          ...prev,
                          genre: e.target.value as PromptDTO['genre']
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                        내용
                      </label>
                      <textarea
                        value={newPrompt.content}
                        onChange={(e) => setNewPrompt(prev => ({
                          ...prev,
                          content: e.target.value
                        }))}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        style={{ minHeight: '250px', height: '250px' }}
                        placeholder="프롬프트 내용을 입력하세요"
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
                        onClick={handleCreate}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer2 text-white rounded-lg hover:bg-pointer transition-colors font-contents"
                      >
                        등록하기
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedPrompt ? (
                <div className="space-y-3 sm:space-y-4">
                  {isEditing ? (
                    // 수정 폼
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">프롬프트 수정</h2>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            제목
                          </label>
                          <input
                            type="text"
                            value={editedPrompt?.title || ''}
                            onChange={(e) => setEditedPrompt(prev => prev ? {
                              ...prev,
                              title: e.target.value
                            } : null)}
                            className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            장르
                          </label>
                          <select
                            value={editedPrompt?.genre || ''}
                            onChange={(e) => setEditedPrompt(prev => prev ? {
                              ...prev,
                              genre: e.target.value as PromptDTO['genre']
                            } : null)}
                            className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {genres.map(genre => (
                              <option key={genre} value={genre}>{genre}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-contents">
                            내용
                          </label>
                          <textarea
                            value={editedPrompt?.content || ''}
                            onChange={(e) => setEditedPrompt(prev => prev ? {
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
                            onClick={handleEdit}
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
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 font-title">프롬프트 상세</h2>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusToggle(selectedPrompt.id)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-contents"
                          >
                            {selectedPrompt.active ? '비활성화' : '활성화'}
                          </button>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-pointer2 text-white rounded-lg hover:bg-pointer transition-colors font-contents"
                          >
                            수정하기
                          </button>
                        </div>
                      </div>
                      <div className="border-b pb-3 sm:pb-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 font-contents">{selectedPrompt.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-contents">장르: {selectedPrompt.genre}</p>
                      </div>
                      <div className="py-2 sm:py-4">
                        <p className="text-sm sm:text-base whitespace-pre-wrap text-gray-700 font-contents">{selectedPrompt.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : filteredPrompts.length === 0 ? (
                // 검색 결과 없음 표시
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500 font-contents">
                    {searchGenre ? 
                      "검색 결과가 없습니다." : 
                      "등록된 프롬프트가 없습니다."
                    }
                  </p>
                </div>
              ) : (
                // 기본 빈 상태 메시지
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500 font-contents">
                    프롬프트를 선택하거나 새로 작성해주세요
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
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <LoadingAnimation />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default PromptManagementPage;