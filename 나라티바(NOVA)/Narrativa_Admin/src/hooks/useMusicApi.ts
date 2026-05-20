import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../components/auth/AuthContext';
import { MusicFile, Genre, GENRE_PATH_MAP } from '../types/music';
import { useToast } from './useToast';
import { auth } from '../configs/firebaseConfig';
import { AdminRole } from '../types/admin';

interface UseMusicApiReturn {
    files: MusicFile[];
    selectedGenre: string | null;
    groupedFiles: { [key: string]: MusicFile[] };
    genres: string[];
    filteredFiles: MusicFile[];
    setSelectedGenre: (genre: string | null) => void;
    fetchFiles: () => Promise<void>;
    uploadMusic: (file: File, genre: Genre) => Promise<void>;
    deleteMusic: (filename: string) => Promise<void>;
    isLoading: boolean;
}

// 백엔드 엔드포인트
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// 권한설정
const DELETE_AUTHORIZED_ROLES: AdminRole[] = ['SUPER_ADMIN', 'SYSTEM_ADMIN'];
const UPLOAD_AUTHORIZED_ROLES: AdminRole[] = ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CONTENT_ADMIN'];

export const useMusicApi = (): UseMusicApiReturn => {
    const [files, setFiles] = useState<MusicFile[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { admin } = useAuth();
    const { showToast } = useToast();

    const checkPermission = (authorizedRoles: AdminRole[]): boolean => {
        return Boolean(admin && authorizedRoles.includes(admin.role));
    };

    const hasUploadPermission = () => checkPermission(UPLOAD_AUTHORIZED_ROLES);
    const hasDeletePermission = () => checkPermission(DELETE_AUTHORIZED_ROLES);

    const getAuthHeaders = async () => {
        const user = auth.currentUser;
        if (!user || !admin) throw new Error("No authenticated user");

        const token = await user.getIdToken();
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Firebase-Token': user.uid
        };
    };

    // 파일 그룹화 메모이제이션
    const groupedFiles = useMemo(() => {
        return files.reduce((acc, file) => {
            if (!file.genre || file.genre === 'UNKNOWN') return acc;
            
            const genre = file.genre;
            if (!acc[genre]) {
                acc[genre] = [];
            }
            acc[genre].push(file);
            return acc;
        }, {} as { [key: string]: MusicFile[] });
    }, [files]);

    // 장르 목록 메모이제이션
    const genres = useMemo(() => {
        return Object.keys(groupedFiles).sort((a, b) => {
            return a.localeCompare(b);
        });
    }, [groupedFiles]);

    // 필터링된 파일 목록 메모이제이션
    const filteredFiles = useMemo(() => {
        if (!selectedGenre) return [];
        return groupedFiles[selectedGenre] || [];
    }, [groupedFiles, selectedGenre]);

    const fetchFiles = useCallback(async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        try {
            const headers = await getAuthHeaders();
            const { data } = await axios.get<MusicFile[]>(`${API_BASE_URL}/api/music/files`, {
                headers,
                withCredentials: true,
                timeout: 30000
            });
            
            if (Array.isArray(data)) {
                const processedData = data.filter(file => {
                    const normalizedGenre = file.genre?.toUpperCase();
                    return normalizedGenre && normalizedGenre !== 'UNKNOWN' && normalizedGenre.trim() !== '';
                }).map(file => {
                    const genreKey = Object.entries(GENRE_PATH_MAP).find(([_, path]) => 
                        file.name.includes(path)
                    )?.[0];
                    
                    return {
                        ...file,
                        genre: genreKey || file.genre
                    };
                });
                
                setFiles(processedData);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
            showToast('파일 목록을 불러오는데 실패했습니다.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast, isLoading, admin]);

    const uploadMusic = async (file: File, genre: Genre) => {
        try {
            if (!hasUploadPermission()) {
                showToast('업로드 권한이 없습니다.', 'error');
                return;
            }
    
            const headers = await getAuthHeaders();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('genre', genre);
    
            // Content-Type 헤더 제거 (브라우저가 자동으로 설정)
            delete headers['Content-Type'];
    
            const response = await axios.post(`${API_BASE_URL}/api/music/upload`, formData, {
                headers: {
                    ...headers,
                    'Accept': 'application/json',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
                    console.log(`업로드 진행률: ${percentCompleted}%`);
                },
                maxContentLength: 52428800, // 50MB
                maxBodyLength: 52428800
            });
            
            showToast('파일이 업로드되었습니다.', 'success');
            await fetchFiles();
            
        } catch (error: any) {
            console.error('Upload error:', error.response || error);
            
            if (error.response?.status === 413) {
                showToast('파일 크기가 너무 큽니다.', 'error');
            } else if (error.response?.status === 415) {
                showToast('지원하지 않는 파일 형식입니다.', 'error');
            } else if (error.response?.status === 401) {
                showToast('인증이 필요합니다.', 'error');
            } else {
                showToast('파일 업로드에 실패했습니다.', 'error');
            }
        }
    };

    const deleteMusic = async (filename: string) => {
        try {
            if (!hasDeletePermission()) {
                showToast('삭제 권한이 없습니다.', 'error');
                return;
            }

            const headers = await getAuthHeaders();
            
            // 파일명만 추출 (경로 제외)
            const fileName = filename.split('/').pop();
            
            if (!fileName) {
                showToast('잘못된 파일명입니다.', 'error');
                return;
            }

            await axios({
                method: 'DELETE',
                url: `${API_BASE_URL}/api/music/delete/${encodeURIComponent(fileName)}`,
                headers,
                withCredentials: true,
                timeout: 10000
            });
            
            showToast('파일이 삭제되었습니다.', 'success');
            await fetchFiles();
        } catch (error: any) {
            console.error('Delete error:', error);
            if (error.response?.status === 404) {
                showToast('파일을 찾을 수 없습니다.', 'error');
            } else if (error.message === 'Network Error') {
                showToast('네트워크 연결을 확인해주세요.', 'error');
            } else {
                showToast('파일 삭제에 실패했습니다.', 'error');
            }
        }
    };

    return {
        files,
        selectedGenre,
        groupedFiles,
        genres,
        filteredFiles,
        setSelectedGenre,
        fetchFiles,
        uploadMusic,
        deleteMusic,
        isLoading
    };
};