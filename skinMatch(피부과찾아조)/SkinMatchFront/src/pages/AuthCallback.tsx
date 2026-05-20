// src/pages/AuthCallback.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { validateOAuthState, getOAuthErrorMessage, checkBrowserSupport } from '@/utils/oauth';

const AuthCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const processedRef = useRef(false); // 중복 실행 방지

    useEffect(() => {
        // 이미 처리되었으면 중복 실행 방지
        if (processedRef.current) return;
        
        const handleOAuthCallback = async () => {
            processedRef.current = true; // 처리 시작 플래그 설정
            
            try {
                console.log('OAuth Callback 처리 시작');
                console.log('Current URL:', window.location.href);
                console.log('Search params:', location.search);
                
                // 브라우저 지원 여부 확인
                if (!checkBrowserSupport()) {
                    console.error('Browser not supported');
                    setStatus('error');
                    toast.error('브라우저가 이 기능을 지원하지 않습니다.');
                    setTimeout(() => navigate('/login', { replace: true }), 3000);
                    return;
                }
                
                // URL에서 파라미터 추출
                const urlParams = new URLSearchParams(location.search);
                const accessToken = urlParams.get('accessToken');
                const refreshToken = urlParams.get('refreshToken');
                const userId = urlParams.get('userId');
                const email = urlParams.get('email');
                const name = urlParams.get('name');
                const error = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');
                const state = urlParams.get('state');
                const provider = urlParams.get('provider') || 'Unknown';

                console.log('URL 파라미터 분석:', {
                    accessToken: accessToken ? 'EXISTS' : 'NULL',
                    refreshToken: refreshToken ? 'EXISTS' : 'NULL',
                    userId,
                    email,
                    name,
                    error,
                    errorDescription,
                    state: state ? 'EXISTS' : 'NULL',
                    provider
                });

                // OAuth State 검증 (CSRF 공격 방지)
                if (state && !validateOAuthState(state)) {
                    console.error('OAuth State validation failed');
                    setStatus('error');
                    toast.error('보안 검증에 실패했습니다. 다시 시도해주세요.');
                    setTimeout(() => navigate('/login', { replace: true }), 3000);
                    return;
                }

                // 에러가 있는 경우
                if (error) {
                    console.error('OAuth 에러:', error, errorDescription);
                    setStatus('error');
                    const errorMessage = getOAuthErrorMessage(error, provider);
                    toast.error(errorMessage);

                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 3000);
                    return;
                }

                // 토큰 유효성 검증
                if (!accessToken || !refreshToken) {
                    console.error('필수 토큰 정보 누락:', {
                        accessToken: !!accessToken,
                        refreshToken: !!refreshToken
                    });
                    setStatus('error');
                    toast.error('인증 토큰을 받지 못했습니다.');
                    setTimeout(() => navigate('/login', { replace: true }), 3000);
                    return;
                }

                // 사용자 정보 유효성 검증
                if (!userId || !email || !name) {
                    console.error('필수 사용자 정보 누락:', {
                        userId: !!userId,
                        email: !!email,
                        name: !!name
                    });
                    setStatus('error');
                    toast.error('사용자 정보를 받지 못했습니다.');
                    setTimeout(() => navigate('/login', { replace: true }), 3000);
                    return;
                }

                console.log('OAuth 성공, 사용자 정보 처리 중');
                
                // 사용자 정보 객체 생성
                const user = {
                    id: userId,
                    email: decodeURIComponent(email),
                    name: decodeURIComponent(name),
                    provider: provider.toLowerCase()
                };

                console.log('생성된 사용자 정보:', user);

                // 토큰 유효성 간단 검증 (JWT 형식 확인)
                const isValidJWT = (token: string) => {
                    const parts = token.split('.');
                    return parts.length === 3;
                };

                if (!isValidJWT(accessToken) || !isValidJWT(refreshToken)) {
                    console.error('Invalid JWT format');
                    setStatus('error');
                    toast.error('토큰 형식이 올바르지 않습니다.');
                    setTimeout(() => navigate('/login', { replace: true }), 3000);
                    return;
                }

                // 인증 컨텍스트에 로그인 상태 설정
                login(user, accessToken, refreshToken);

                setStatus('success');

                // 성공 토스트 표시
                toast.success(`환영합니다, ${user.name}님!`);

                // 2초 후 메인 페이지로 이동
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 2000);
                
            } catch (error) {
                console.error('OAuth callback 처리 중 예외:', error);
                setStatus('error');

                toast.error("로그인 처리 중 오류가 발생했습니다.");

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            }
        };

        handleOAuthCallback();
    }, [location.search, navigate, login]); // 의존성 배열 개선

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 처리 중...</h2>
                        <p className="text-gray-600">잠시만 기다려 주세요.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-green-800 mb-2">로그인 성공!</h2>
                        <p className="text-gray-600">메인 페이지로 이동합니다.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-red-800 mb-2">로그인 실패</h2>
                        <p className="text-gray-600">로그인 페이지로 돌아갑니다.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;