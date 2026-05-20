// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

interface User {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    profileImage?: string;
    gender?: string;
    birthYear?: string;
    nationality?: string;
    allergies?: string;
    surgicalHistory?: string;
    provider?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const useAuth = () => {
    // localStorage에서 저장된 사용자 정보 불러오기
    const getStoredUser = (): User | null => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('저장된 사용자 정보 파싱 실패:', error);
        }
        return null;
    };

    const [authState, setAuthState] = useState<AuthState>(() => {
        const storedUser = getStoredUser();
        return {
            user: storedUser || null,
            isLoading: true, // 초기에는 로딩 상태
            isAuthenticated: !!storedUser,
        };
    });

    // 초기 로딩 시 서버에서 사용자 정보 가져오기
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token && token !== 'undefined' && token !== 'null') {
                    // 토큰이 있으면 서버에서 최신 사용자 정보 가져오기
                    const response = await authService.getCurrentUser();
                    if (response.success && response.data) {
                        const userData: User = {
                            id: response.data.id?.toString() || '',
                            email: response.data.email || '',
                            name: response.data.name || '',
                            nickname: response.data.nickname || '',
                            profileImage: response.data.profileImage || response.data.profileImageUrl,
                            gender: response.data.gender,
                            birthYear: response.data.birthYear,
                            nationality: response.data.nationality,
                            allergies: response.data.allergies,
                            surgicalHistory: response.data.surgicalHistory,
                            provider: response.data.provider,
                            role: response.data.role,
                        };
                        
                        setAuthState({
                            user: userData,
                            isLoading: false,
                            isAuthenticated: true,
                        });
                        
                        // localStorage에 최신 정보 저장
                        localStorage.setItem('userInfo', JSON.stringify(userData));
                        return;
                    }
                }
                
                // 토큰이 없거나 API 실패시 로그아웃 상태
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
                
            } catch (error) {
                console.error('Auth initialization failed:', error);
                // 에러시 로그아웃 상태
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        };

        initializeAuth();
    }, []);

    // 초기 인증 상태 체크 (비활성화)
    // useEffect(() => {
    //     checkAuthStatus();
    // }, []);

    const checkAuthStatus = async () => {
        // 개발/테스트 모드에서는 항상 인증된 상태 유지
        return;
        
        /*
        // 원래 인증 로직 (주석 처리)
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = localStorage.getItem('userInfo');

            if (!accessToken) {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
                return;
            }

            // 로컬 스토리지에서 사용자 정보가 있으면 먼저 설정
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setAuthState({
                    user: parsedUser,
                    isLoading: false,
                    isAuthenticated: true,
                });
            }

            // 백엔드에서 최신 사용자 정보 가져오기 (토큰 유효성도 함께 검증)
            try {
                const response = await authService.getCurrentUser();
                if (response.success) {
                    const userData = response.data;
                    const user: User = {
                        id: userData.id?.toString() || '',
                        email: userData.email || '',
                        name: userData.name || '',
                        nickname: userData.nickname,
                        profileImage: userData.profileImage,
                        gender: userData.gender,
                        birthYear: userData.birthYear,
                        nationality: userData.nationality,
                        allergies: userData.allergies,
                        surgicalHistory: userData.surgicalHistory,
                        provider: userData.provider,
                        role: userData.role,
                    };

                    setAuthState({
                        user,
                        isLoading: false,
                        isAuthenticated: true,
                    });

                    // 최신 정보로 localStorage 업데이트
                    localStorage.setItem('userInfo', JSON.stringify(user));
                }
            } catch (error) {
                console.warn('Failed to fetch current user, using local data:', error);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            // 토큰이 유효하지 않은 경우 로그아웃 처리
            logout();
        }
        */
    };

    const login = async (user: User, accessToken: string, refreshToken: string) => {
        // 토큰을 먼저 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(user));

        // 임시로 로그인된 상태 설정
        setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
        });

        try {
            // 로그인 후 서버에서 최신 사용자 정보 가져오기
            console.log('로그인 후 최신 사용자 정보 조회 시작...');
            const response = await authService.getCurrentUser();
            
            if (response.success && response.data) {
                console.log('서버에서 받은 최신 사용자 정보:', response.data);
                
                const latestUserData: User = {
                    id: response.data.id?.toString() || '',
                    email: response.data.email || '',
                    name: response.data.name || '',
                    nickname: response.data.nickname || '',
                    profileImage: response.data.profileImage || response.data.profileImageUrl,
                    gender: response.data.gender,
                    birthYear: response.data.birthYear,
                    nationality: response.data.nationality,
                    allergies: response.data.allergies,
                    surgicalHistory: response.data.surgicalHistory,
                    provider: response.data.provider,
                    role: response.data.role,
                };
                
                console.log('최신 닉네임:', latestUserData.nickname);
                
                // 최신 정보로 상태 업데이트
                setAuthState({
                    user: latestUserData,
                    isLoading: false,
                    isAuthenticated: true,
                });
                
                // localStorage에 최신 정보 저장
                localStorage.setItem('userInfo', JSON.stringify(latestUserData));
                console.log('최신 사용자 정보로 업데이트 완료');
            }
        } catch (error) {
            console.error('최신 사용자 정보 조회 실패:', error);
            // 실패해도 기존 로그인 상태 유지
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // API 실패와 관계없이 로컬 데이터는 정리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userId');

            // 상태를 완전히 초기화
            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    const refreshAuthState = (): void => {
        checkAuthStatus();
    };

    const updateUser = (updatedUser: Partial<User>): void => {
        if (!authState.user) return;
        
        const newUser = { ...authState.user, ...updatedUser };
        
        setAuthState(prev => ({
            ...prev,
            user: newUser
        }));
        
        // localStorage에도 업데이트된 정보 저장
        localStorage.setItem('userInfo', JSON.stringify(newUser));
    };

    return {
        user: authState.user,
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
        login,
        logout,
        refreshAuthState,
        updateUser,
    };
};
