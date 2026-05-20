import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWithdrawUser, type WithdrawUserError } from '@/features/mainpage/service/useWithdrawUser';
import { useAuthState } from '@/shared/hooks/useAuthState';
import Header from '../shared/components/Header'; // Header 

const WarningIcon = () => (
  <svg
    className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WithdrawUser = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuthState();
  const { mutate, isPending } = useWithdrawUser();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    if (!isPending) {
      setIsDialogOpen(false);
      setPassword('');
      setError(null);
    }
  };

  const handleWithdraw = () => {
    if (!password.trim() && !window.confirm('정말로 비밀번호 없이 탈퇴하시겠습니까?')) {
      return;
    }

    setError(null);

    mutate(
      { password: password.trim() || undefined },
      {
        onSuccess: (data) => {
          logout();
          setTimeout(() => {
            navigate('/', { replace: true });
            alert(data.message || '회원 탈퇴가 완료되었습니다.');
          }, 500);
        },
        onError: (error: WithdrawUserError) => {
          setError(error.message || '회원 탈퇴 중 오류가 발생했습니다.');
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isPending) {
      handleWithdraw();
    }
  };

  return (
    <>
      <Header onBack={() => navigate(-1)} />

      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">회원 탈퇴</h2>

        <div className="flex items-start p-5 mb-8 bg-blue-50 rounded-lg border border-blue-200">
          <WarningIcon />
          <p className="text-base text-blue-700 leading-relaxed">
            탈퇴 시 모든 개인 정보와 데이터가 삭제되며 복구할 수 없습니다.
          </p>
        </div>

        <button
          onClick={handleOpenDialog}
          disabled={isPending}
          className="w-full px-5 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '처리 중...' : '회원 탈퇴하기'}
        </button>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">정말로 탈퇴하시겠습니까?</h3>
                  <button
                    onClick={handleCloseDialog}
                    disabled={isPending}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <p className="text-base text-gray-600 mb-6">
                  탈퇴 시 모든 개인 정보와 데이터가 삭제되며, 복구할 수 없습니다.
                </p>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      비밀번호 (소셜 로그인 사용자는 생략 가능)
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isPending}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>

                  {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 rounded-md">{error}</div>
                  )}

                  <div className="flex justify-end space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseDialog}
                      disabled={isPending}
                      className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleWithdraw}
                      disabled={isPending}
                      className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isPending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          처리 중...
                        </>
                      ) : (
                        '탈퇴하기'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WithdrawUser;
