import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const NotificationList: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_SPRING_URI}/api/notices`
      );
      setNotices(response.data);
    } catch (err) {
      setError("공지사항을 불러오는데 실패했습니다.");
      console.error("Error fetching notices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (id: number) => {
    navigate(`/notification/${id}`);
  };

  if (isLoading) {
    return <div className="text-center p-4">로딩중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-custom-background p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">공지사항</h1>
      {notices.length === 0 ? (
        <p className="text-center text-gray-500">등록된 공지사항이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {notices.map((notice) => (
            <li
              key={notice.id}
              onClick={() => {
                playSound(0);
                handleNoticeClick(notice.id);
              }}
              className="p-4 bg-white dark:dark:bg-gray-800 rounded-lg shadow-lg 
                dark:shadow-gray-950 hover:bg-gray-200 dark:hover:bg-gray-600 
                transition cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                  {notice.title}
                </h2>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{notice.createdBy}</span>
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
