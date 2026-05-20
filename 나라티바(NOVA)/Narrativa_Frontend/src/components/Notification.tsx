import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

interface Notice {
  id: number;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const Notification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  useEffect(() => {
    fetchNoticeDetail();
  }, [id]);

  const fetchNoticeDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_SPRING_URI}/api/notices/${id}`
      );
      setNotice(response.data);
    } catch (err) {
      setError("공지사항을 불러오는데 실패했습니다.");
      console.error("Error fetching notice detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-950">
        <p className="text-center">로딩중...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-950">
        <h1 className="text-2xl font-bold mb-4 text-red-500">
          {error || "공지사항을 찾을 수 없습니다."}
        </h1>
        <button
          onClick={() => {
            playSound(0);
            handleGoBack();
          }}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {notice.title}
        </h1>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>작성자: {notice.createdBy}</span>
          <span>작성일: {new Date(notice.createdAt).toLocaleDateString()}</span>
        </div>
        {notice.updatedAt !== notice.createdAt && (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-right mb-4">
            수정일: {new Date(notice.updatedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {notice.content}
        </div>
      </div>

      <button
        onClick={() => {
          playSound(0);
          handleGoBack();
        }}
        className="mt-8 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default Notification;
