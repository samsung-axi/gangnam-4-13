import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../Contexts/NotificationContext";
import axios from "axios";
import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";
import Lottie from "lottie-react";
import noticeLottie from "./notice.json"; // Lottie JSON file

interface Notice {
  id: number;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const { isNotificationsOn } = useNotification();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SPRING_URI}/api/notices`
        );

        const notices = response.data;
        if (notices && notices.length > 0) {
          setLatestNotice(notices[0]);
        }
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.pathname === "/home") {
      fetchLatestNotice();
    }
  }, [location.pathname]);

  return (
    <header className="flex flex-col items-center w-full max-w-lg mx-auto p-4 bg-white dark:bg-custom-background text-black fixed top-0 z-10 dark:text-white">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link
            to="/home"
            onClick={() => playSound(0)} // 효과음 추가
          >
            <img
              src="/images/Group 18317.webp"
              alt="Bookmarks"
              className="h-[6svh] dark:invert" // 높이를 svh로 조정
            />
          </Link>
        </div>

        {/* Lottie Animation and Menu */}
        <div className="flex items-center space-x-0">
          {/* Lottie Animation */}
          <div
            className="relative cursor-pointer "
            style={{ transform: "translateX(8px) translateY(-8px)" }}
            onClick={() => {
              playSound(0); // 효과음 추가
              openModal(); // 모달 열기
            }}
          >
            <Lottie
              animationData={noticeLottie}
              loop={true}
              autoplay={true}
              className="w-[3svh] h-[3svh] " // 크기를 일정하게 설정
            />
          </div>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                playSound(0);
                setIsMenuOpen((prev) => !prev);
              }}
              className="self-end focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <img
                src="/images/nav.webp"
                alt="Profile"
                className="w-[4svh] mt-[2svh] dark:invert" // 크기 및 여백을 svh로 조정
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 w-[20svh] bg-white dark:bg-custom-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition ease-out duration-200">
                <ul className="flex flex-col p-[1svh]">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-[2svh] py-[1svh] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      onClick={() => {
                        playSound(0);
                        setIsMenuOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/bookmarks"
                      className="block px-[2svh] py-[1svh] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      onClick={() => {
                        playSound(0);
                        setIsMenuOpen(false);
                      }}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notification-list"
                      className="block px-[2svh] py-[1svh] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      onClick={() => {
                        playSound(0);
                        setIsMenuOpen(false);
                      }}
                    >
                      Notification
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && latestNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {latestNotice.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {latestNotice.content}
            </p>
            <button
              onClick={closeModal}
              className="w-full px-4 py-2 bg-custom-violet text-white font-semibold rounded-lg hover:bg-custom-purple transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
