import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Clock, User } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Notice, NoticeStatus } from '../../types/notice';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';
import LoadingAnimation from '../../components/ui/LoadingAnimation';

const StatusBadge = ({ status }: { status: NoticeStatus }) => {
  const statusStyles = {
    ACTIVE: { className: 'bg-green-100 text-green-600', label: '게시됨' },
    INACTIVE: { className: 'bg-gray-100 text-gray-600', label: '비활성' }
  };

  const { className, label } = statusStyles[status];
  return (
    <span className={`px-2 py-1 text-xs rounded font-contents ${className}`}>
      {label}
    </span>
  );
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const noticeId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!noticeId) {
        setError('유효하지 않은 공지사항 ID입니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Notice>(
          `${process.env.REACT_APP_BACKEND_URL}/api/notices/${noticeId}`
        );
        setNotice(response.data);
      } catch (err) {
        console.error('Failed to fetch notice:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
        showToast('공지사항을 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [noticeId, showToast]);

  const handleBack = () => navigate('/notices');
  const handleEdit = () => navigate(`/notices/${noticeId}/edit`);
  const handleDelete = async () => {
    if (!noticeId) return;

    const isConfirmed = await showConfirm({
      title: '공지사항을 삭제하시겠습니까?',
      html: '삭제된 공지사항은 복구할 수 없습니다.',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (isConfirmed) {
      try {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/notices/${noticeId}/delete`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Firebase-Token': currentUser.uid
            }
          }
        );
        showToast('삭제되었습니다', 'success');
        navigate('/notices');
      } catch (error) {
        console.error('Failed to delete notice:', error);
        showToast('삭제 중 오류가 발생했습니다.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div 
        className="h-full w-full p-6 text-center"
        style={{
          backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        <LoadingAnimation />
      </div>
    );
  }

  // 에러 상태
  if (error || !notice) {
    return (
      <div className="h-full w-full p-6 text-center">
        <p className="text-red-500">{error || '공지사항을 찾을 수 없습니다.'}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 text-pointer hover:text-white font-contents"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 메인 렌더링
  return (
    <div 
      className="h-full w-full p-4 sm:p-6"
      style={{
        backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* 헤더 섹션 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-contents font-bold text-pointer hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-contents">목록으로</span>
        </button>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleEdit}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 font-contents text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="w-4 h-4" />
            <span>수정</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 font-contents text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>삭제</span>
          </button>
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <StatusBadge status={notice.status} />
          <h1 className="text-xl sm:text-2xl font-contents font-bold text-gray-800 break-all">
            {notice.title}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 font-contents text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            관리자 {notice.createdBy}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(notice.createdAt)}
          </div>
          {notice.updatedAt !== notice.createdAt && (
            <div className="text-gray-400">
              (수정됨: {formatDate(notice.updatedAt)})
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          {notice.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 font-contents text-gray-700 leading-relaxed break-all">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;