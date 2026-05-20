import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa'; // 돋보기 아이콘 import, FaTimes 아이콘 추가
import '../../css/linkpage/SearchYoutube.css';
import youtubeIcon from '../../images/YOUTUBE_LOGO.png';
import Modal from '../../layouts/AlertModal';

const SearchYoutube = ({ linkData, setLinkData }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isShortcut, setIsShortcut] = useState(false);

    const navigate = useNavigate();

    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (searchQuery) {
            localStorage.setItem('youtubeSearchQuery', searchQuery);
            if (isShortcut) {
                searchYoutube();
                setIsShortcut(false);
            }
        }
    }, [searchQuery]);

    useEffect(() => {
        localStorage.setItem('youtubeSearchResults', JSON.stringify(searchResults));
    }, [searchResults]);

    useEffect(() => {
        localStorage.setItem('youtubeSelectedVideos', JSON.stringify(selectedVideos));
    }, [selectedVideos]);

    // 컴포넌트 마운트 시 검색어 이력 조회
    useEffect(() => {
        const fetchRecentSearches = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/search/recent', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setRecentSearches(response.data);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('검색어 이력 조회 실패:', error);
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchRecentSearches();
    }, []);

    // API 키를 사용할 때, 하드코딩된 값을 제거하고 환경변수에서 받아옵니다.
    const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY.trim();

    // 날짜 포맷팅 함수 추가
    const formatDate = (publishedAt) => {
        if (!publishedAt) return '';
        const date = new Date(publishedAt);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    // 제목 텍스트 제한 함수 수정
    const truncateTitle = (title) => {
        if (title.length > 35) {
            return title.substring(0, 35) + '...';
        }
        return title;
    };

    // 검색 함수 저장 및 호출 프로세스
    const searchYoutube = async () => {
        if (!searchQuery?.trim()) return;

        setIsLoading(true);
        try {
            // 검색어 저장
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.post(process.env.REACT_APP_BACKEND_URL + '/user/search/save',
                        { searchTerm: searchQuery.trim() },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } catch (error) {
                    console.error('검색어 저장 실패:', error);
                    navigate('/login');
                }
            }

            // YouTube 검색 API 호출
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    key: YOUTUBE_API_KEY, // 환경변수에서 받아온 API 키 사용
                    q: searchQuery.trim(),
                    type: 'video'
                }
            });

            if (response.data.items) {
                const videos = response.data.items.map(item => ({
                    id: item.id.videoId,
                    title: truncateTitle(item.snippet.title), // 45자로 제한
                    fullTitle: item.snippet.title, // 전체 제목 저장
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channelTitle: item.snippet.channelTitle,
                    publishedAt: formatDate(item.snippet.publishedAt), // 날짜 포맷팅 적용
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    duration: item.snippet.duration
                }));

                setSearchResults(videos);
            }
        } catch (error) {
            console.error(error);
            setModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    // 검색어 초기화
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        localStorage.removeItem('youtubeSearchQuery');
        localStorage.removeItem('youtubeSearchResults');
    };

    const checkVideoSubtitles = async (videoId) => {
        try {
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + '/url/check_youtube_subtitles',
                { video_url: videoUrl }
            );
            console.log("자막 체크 응답:", response.data);
            return response.data.has_subtitles;
        } catch (error) {
            console.error("자막 확인 실패:", error);
            return false;
        }
    };

    const handleVideoSelect = async (video) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        console.log('video:', video);
        const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
        const exists = selectedVideos.find(v => v.url === videoUrl);
        let updatedSelection = [];

        if (exists) {
            console.log('삭제 요청 전송, videoUrl:', videoUrl);
            await axios.delete(process.env.REACT_APP_BACKEND_URL + '/user/delete', {
                params: { url: videoUrl },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            updatedSelection = selectedVideos.filter(v => v.url !== videoUrl);
            setSelectedVideos(updatedSelection);
            setLinkData(prev => prev.filter(v => v.url !== videoUrl));
        } else {
            if (linkData.length >= 5) {

                setModalMessage('링크는 최대 5개까지만 추가 가능합니다.');

                setModalOpen(true);
                return;
            }

            // 클라이언트에서 바로 자막 여부 체크
            const hasSubtitles = await checkVideoSubtitles(video.id);
            if (!hasSubtitles) {

                setModalMessage('자막이 포함된 영상을 선택해주세요!');

                setModalOpen(true);
                return;
            }

            try {
                const requestPayload = {
                    url: videoUrl,
                    title: video.fullTitle || video.title,
                    author: video.channelTitle,
                };

                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/user/save', requestPayload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('저장 응답:', response.data);

                updatedSelection = [...selectedVideos, { ...requestPayload, selected: true }];
                setSelectedVideos(updatedSelection);
                setLinkData(prev => [...prev, requestPayload]);
            } catch (error) {
                console.error("저장 실패:", error);
                let msg = '저장 실패';
                if (error.response && error.response.data) {
                    msg = error.response.data.message || JSON.stringify(error.response.data);
                }
                setModalMessage(msg);
                setModalOpen(true);
            }
        }

    };

    // 렌더링 시 현재 상태 확인
    console.log('현재 검색 결과:', searchResults);
    console.log('로딩 상태:', isLoading);

    useEffect(() => {
        // 백엔드에 저장된 링크 데이터를 가져오는 예시
        const fetchLinkData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user/url/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const savedLinks = response.data;
                setLinkData(savedLinks);
                setSelectedVideos(savedLinks);
            } catch (error) {
                console.error("링크 데이터 불러오기 실패:", error);
            }
        };

        fetchLinkData();
    }, []);

    return (
        <div className="WS-SearchYoutube-Tab">

            <div className="WS-Link-Input-Container">
                <input
                    type="text"
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchYoutube()}
                    placeholder="YouTube 검색어를 입력하세요"
                    className="WS-Link-Input"
                />

                <div className="WS-Link-Button-Container">
                    {searchQuery && (
                        <button
                            className="WS-SearchYoutube-ClearButton"
                            onClick={clearSearch}
                            type="button"
                            aria-label="검색어 지우기"
                        >
                            <FaTimes />
                        </button>
                    )}

                    <button
                        onClick={searchYoutube}
                        className="WS-SearchYoutube-SearchButton"
                        disabled={isLoading}
                        aria-label="검색"
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>

            <div className={`WS-SearchYoutube-Results ${selectedVideos.length > 0 ? 'has-selected' : ''}`}>
                {isLoading ? (
                    <div className="WS-SearchYoutube-Loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    <>
                        {searchResults.map((video) => (
                            <div
                                key={video.id}
                                className={`WS-SearchYoutube-Results-Item ${selectedVideos.some(v => v.url === `https://www.youtube.com/watch?v=${video.id}`) ? 'selected' : ''
                                    }`}
                                onClick={() => handleVideoSelect(video)}
                            >
                                <div className="WS-SearchYoutube-Thumbnail-Container">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.fullTitle}
                                        className="WS-SearchYoutube-Thumbnail"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
                                        }}
                                        className="WS-youtube-icon-link"
                                    >
                                        <img
                                            src={youtubeIcon}
                                            alt="YouTube"
                                            className="WS-youtube-icon"
                                        />
                                    </button>
                                </div>
                                <div className="WS-SearchYoutube-Info-Container">
                                    <h3 className="WS-SearchYoutube-Title" title={video.fullTitle}>{video.title}</h3>
                                    <div className="WS-SearchYoutube-ChannelInfo">
                                        <span className="WS-SearchYoutube-ChannelName">
                                            {video.channelTitle}
                                        </span>
                                        <span className="WS-SearchYoutube-Date">
                                            {video.publishedAt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="WS-SearchYoutube-NoResults">
                        <div className="WS-SearchYoutube-RecentSearches-Title">최근 검색어</div>
                        <div className="WS-SearchYoutube-RecentSearches">
                            {recentSearches.map((keyword, index) => (
                                <button
                                    key={index}
                                    className="WS-SearchYoutube-RecentSearch-Tag"
                                    onClick={() => {
                                        setSearchQuery(keyword);
                                        setIsShortcut(true);
                                    }}
                                >
                                    {keyword}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                message={modalMessage}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default SearchYoutube; 