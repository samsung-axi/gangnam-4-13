import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import { useCookies } from "react-cookie";
import axiosBaseURL from "../api/axios";
import AuthGuard from "../api/accessControl";
import { useDarkMode } from "../Contexts/DarkModeContext";
import { useNotification } from "../Contexts/NotificationContext";
import { parseCookieKeyValue } from "../api/cookie";
import { useSoundContext } from "../Contexts/SoundContext";

import { useMultipleSoundEffects } from "../hooks/useMultipleSoundEffects";

interface UserProfileInfo {
  username: string;
  profile_url: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate(); // navigate 훅을 사용하여 리디렉션

  const { isSoundOn, toggleSound } = useSoundContext();
  const { playSound } = useMultipleSoundEffects(["/audios/button2.mp3"]);

  // 개별 효과음 재생 (전역 상태와 독립적)
  // const playIndividualSound = (soundSrc: string) => {
  //   if (isSoundOn) {
  //     const sound = new Howl({ src: [soundSrc], volume: 0.5 });
  //     sound.play();
  //   }
  // };
  const toggleBGM = () => {
    playSound(0); // 토글 효과음 재생
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [nickname, setNickname] = useState<string>(""); // 닉네임 초기 상태 비우기
  const [profileUrl, setProfileUrl] = useState<string>(""); // profile url

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const { isNotificationsOn, toggleNotifications } = useNotification();

  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [userId, setUserId] = useState(-1);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [img, setImg] = useState<File | null>(null); // 이미지
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 이미지 상태

  const [isOpen, setIsOpen] = useState<boolean>(false); // 개인정보처리방침 모달창 on/off
  const [policyText, setPolicyText] = useState<string>(""); // 개인정보처리방침 내용

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  const randomName = React.useMemo(
    () => Math.random().toString(36).substring(2, 10),
    []
  );

  const fetchUserData = async (userId: number, accessToken: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/users`,
        {
          method: "GET", // 기본적으로 GET 요청
          headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include", // 쿠키를 요청에 포함시키기
        }
      );

      if (!response.ok) throw new Error("Failed to fetch profile data.");

      let data = await response.json();

      const tmp_nickname = data.nickname;
      const tmp_profileUrl = data.profile_url;

      // 만약 data가 JSON 문자열이라면, 파싱을 시도
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      // 상태에 사용자 데이터 저장
      setNickname(tmp_nickname);
      setProfileUrl(tmp_profileUrl);
    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to load user data.");
      }
    }
  };

  // 유저 유효성 검증
  const checkAuth = async (userId: number, accessToken: string) => {
    const isAuthenticated = await AuthGuard(userId, accessToken);
    // console.log('유저 유효성 여부: ', isAuthenticated);
    if (!isAuthenticated) {
      navigate("/");
    }
  };

  // 데이터베이스에서 닉네임 가져오기
  useEffect(() => {
    const cookieToken = cookie.token;

    cookieToken == null && navigate("/");

    const _cookieContent = parseCookieKeyValue(cookieToken);

    if (_cookieContent != null) {
      const _cookieContentAccesToken = _cookieContent.access_token;
      const _cookieContentId = _cookieContent.user_id;

      if (_cookieContentAccesToken != null && _cookieContentId != null) {
        setAccessToken(_cookieContentAccesToken);
        setUserId(_cookieContentId);
        fetchUserData(_cookieContentId, _cookieContentAccesToken);

        if (!checkAuth(_cookieContentId, _cookieContentAccesToken)) {
          navigate("/"); // 유저 상태코드 유효하지 않으면 접근 불가 설정
        }
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  // 수정 완료 버튼 클릭 시 데이터베이스에 저장
  const handleSave = async () => {
    const profileImgData = {
      image: profileUrl,
    };

    try {
      if (!img) {
        alert("이미지를 선택해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append("image", img);

      // Get file extension
      const fileExtension = img.name.split(".").pop()?.toLowerCase();

      // Check if file extension is one of the allowed types
      const allowedExtensions = ["jpg", "jpeg", "png", "svg"];

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert("해당 파일은 이미지가 아닙니다.");
        return;
      }

      // console.log('userId: ', userId);
      // console.log('accessToken: ', accessToken);
      // console.log('formData.image: ', formData.get('image'));
      // s3에 이미지 저장
      const saveImgToS3 = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/s3/images/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, // 수정된 데이터 전송
          credentials: "include",
        }
      );

      if (!saveImgToS3.ok) throw new Error("s3 이미지 업로드 실패");

      // s3 저장 후 img url 얻음(해당 url 클릭시 이미지 조회 불가 -> 다음 단계에서 얻는 url 이용시 이미지 조회)
      const text = await saveImgToS3.text();
      const data = JSON.parse(text);

      const imageUrlValue = data.imageUrl;

      const extractFilePath = (url: string): string => {
        const parsedUrl = new URL(url); // URL 객체로 파싱
        const path = parsedUrl.pathname; // 경로 부분 추출 ("/test/wfle.jpg")

        return path.substring(1); // "/"를 제외한 경로 부분만 반환
      };

      const extractS3FilePath = extractFilePath(imageUrlValue);

      // s3에 이미지 저장
      const fetchPresignedUrl = await fetch(
        `${
          process.env.REACT_APP_SPRING_URI
        }/api/s3/image?filePath=${encodeURIComponent(extractS3FilePath)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include", // 쿠키를 요청에 포함시키기
        }
      );

      if (!fetchPresignedUrl.ok) throw new Error("s3 PresignedUrl 요청 실패");

      const presignedUrlText = await fetchPresignedUrl.text();

      setProfileUrl(presignedUrlText);

      const profileData = {
        nickname,
        profile_url: presignedUrlText, // 프로필 이미지 키
      };

      // 닉네임, 프로필 url 저장
      const response = await fetch(
        `${process.env.REACT_APP_SPRING_URI}/api/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData), // 수정된 데이터 전송
          credentials: "include", // 쿠키를 요청에 포함시키기
        }
      );

      if (!response.ok) throw new Error("닉네임, 프로필 url 저장 실패");
      alert("프로필이 성공적으로 저장되었습니다.");
      setIsEditMode(false); // 수정 모드 종료
    } catch (error) {
      if (error instanceof Error) {
        alert("프로필 저장 중 오류가 발생했습니다.");
      }
    }
  };

  // URL에서 최상위 도메인과 두 번째 레벨 도메인을 추출하는 함수
  const getCookieDomainFromUrl = (): string => {
    const parsedUrl = new URL(`${process.env.REACT_APP_SPRING_URI}`); // URL 객체를 사용하여 URL을 파싱
    const domainParts = parsedUrl.hostname.split("."); // 호스트명에서 도메인 부분만 분리
    return domainParts.slice(domainParts.length - 2).join("."); // 두 번째 레벨 도메인과 최상위 도메인만 반환
  };

  // 쿠키 삭제 함수
  const removeUserCookie = () => {
    if (userId !== null) {
      // URL에서 도메인 추출
      const cookieDomain = getCookieDomainFromUrl();

      // 쿠키 삭제
      removeCookie("token", { domain: cookieDomain, path: "/" });
    }
  };

  // 회원 탈퇴 요청 함수
  const deactivateAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosBaseURL.put(
        `/api/users/deactivate`,
        {},
        {
          headers: {
            "Content-Type": "application/json", // 요청 헤더 설정
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더 설정
          },
          withCredentials: true, // 쿠키를 요청에 포함시키기
        }
      );

      removeUserCookie();

      // 탈퇴 성공 후 alert 창 띄우기
      alert("회원 탈퇴가 완료되었습니다.");

      // 메인 화면으로 리디렉션
      navigate("/");
    } catch (error) {
      setError("회원 탈퇴에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로그 아웃 함수
  const handleRemoveCookie = () => {
    if (userId !== null) {
      removeUserCookie();

      // 탈퇴 성공 후 alert 창 띄우기
      alert("로그 아웃이 완료되었습니다.");

      // 메인 화면으로 리디렉션
      navigate("/");
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImg(file);
      convertToBase64(file);

      // 이미지 미리보기 URL 생성
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // 파일 업로드 함수
  const handleFileUpload = async () => {
    if (!img) {
      setError("파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", img);
  };

  // 파일을 Base64로 변환
  const convertToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Base64로 변환된 이미지 URL을 상태에 저장
      if (reader.result) {
        setProfileUrl(reader.result as string); // Base64 문자열로 저장
      }
    };
    reader.readAsDataURL(file); // 파일을 Base64 형식으로 읽음
  };

  // 모달을 열 때 파일을 불러오는 함수
  const openModal = async () => {
    try {
      const response = await fetch("/personal-info-policy.txt");
      if (response.ok) {
        const text = await response.text();
        setPolicyText(text);
        setIsOpen(true);
      } else {
        console.error("파일을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // console.log("profileUrl updated: ", profileUrl);
  }, [profileUrl]);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      <div className="relative">
        <div className="w-48 h-48 border-1 border-gray-200 rounded-full overflow-hidden">
          {/* previewUrl 1순위, profileUrl 2순위, 기본 Avatar 컴포넌트 3순위 */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : profileUrl ? (
            <img
              src={profileUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar
              size={190}
              name={randomName}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          )}
        </div>
        {/* isEditMode가 true일 때만 파일 업로드 기능 표시 */}
        {isEditMode && (
          <>
            {/* 이미지 클릭 시 파일 선택 */}
            <button
              className="w-48 grid place-items-center"
              onClick={() => {
                playSound(0);
                document.getElementById("fileInput")?.click();
              }}
            >
              <img
                src="/images/edit_camera.webp"
                alt="Edit Nickname"
                className="w-8 h-8 grid place-items-center"
              />
            </button>

            {/* 숨겨진 input[type="file"] */}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }} // input을 숨기기
              onChange={handleFileChange} // 파일이 선택되면 이 함수 호출
            />
          </>
        )}
      </div>

      <div className="flex flex-col items-center relative dark:text-white">
        <h1 className="text-2xl my-4 font-bold" title="Nickname">
          {isEditingNickname ? (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => setIsEditingNickname(false)}
              className="text-2xl font-bold text-center w-auto px-1  rounded-md dark:text-black"
              style={{
                width: `${nickname.length + 3}ch`,
              }}
            />
          ) : (
            nickname || "로딩 중.."
          )}

          {isEditMode && !isEditingNickname && (
            <button
              onClick={() => {
                playSound(0);
                setIsEditingNickname(true);
              }}
              className="absolute -right-8 top-5 text-lg ml-2"
            >
              <img
                src="/images/edit_pen.webp"
                alt="Edit Nickname"
                className="w-6 h-6 dark:invert"
              />
            </button>
          )}
        </h1>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => {
            playSound(0);
            if (isEditMode) {
              handleSave(); // 수정 완료 로직
            } else {
              setIsEditMode(true); // 수정 모드 활성화
            }
          }}
          className={`px-10 py-2 text-white rounded my-2 bg-custom-violet shadow-lg dark:shadow-lg hover:bg-blue-900 dark:text-white`}
        >
          {isEditMode ? "수정 완료" : "회원 수정"}
        </button>
      </div>

      <div className="space-y-4">
        <label
          className="flex items-center cursor-pointer px-10 py-4 text-black border shadow-lg dark:shadow-gray-950
        bg-white dark:bg-[rgb(37,42,52)] bg-opacity-100 shadow-sm dark:bg-opacity-80 border-gray-200 rounded mt-12 dark:text-white dark:border-opacity-10"
        >
          <span className="w-56 text-sm">다크모드</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer overflow-hidden ${
              isDarkMode ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={() => {
              playSound(0);
              toggleDarkMode();
            }} // 전역 토글 함수 호출
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isDarkMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        {/* <label
          className="flex items-center cursor-pointer px-10 py-4 text-black border shadow-lg dark:shadow-gray-950
        bg-white dark:bg-[rgb(37,42,52)] bg-opacity-100 shadow-sm dark:shadow-gray-900 dark:bg-opacity-80 border-gray-200 rounded mt-4 dark:text-white dark:border-opacity-10"
        >
          <span className="w-56 text-sm">배경음악</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer overflow-hidden ${
              bgmEnabled ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={() => {
              playSound(0);
              toggleBGM();
            }}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                bgmEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label> */}
        <label
          className="flex items-center cursor-pointer px-10 py-4 text-black border shadow-lg dark:shadow-gray-950
        bg-white dark:bg-[rgb(37,42,52)] bg-opacity-100 shadow-sm dark:shadow-gray-900 dark:bg-opacity-80 border-gray-200 rounded mt-4 dark:text-white dark:border-opacity-10"
        >
          <span className="w-56 text-sm">효과음</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer overflow-hidden ${
              isSoundOn ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={() => {
              playSound(0);
              toggleSound();
            }} // toggleSound를 직접 호출
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isSoundOn ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>

        <label
          className="flex items-center cursor-pointer px-10 py-4 text-black border shadow-lg dark:shadow-gray-950
        bg-white dark:bg-[rgb(37,42,52)] bg-opacity-100 shadow-sm dark:shadow-gray-900 dark:bg-opacity-80 border-gray-200 rounded mt-4 dark:text-white dark:border-opacity-10"
        >
          <span className="w-56 text-sm">공지사항</span>
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer overflow-hidden ${
              isNotificationsOn ? "bg-custom-violet" : "bg-gray-300"
            }`}
            onClick={toggleNotifications}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isNotificationsOn ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      <div className="text-sm text-gray-500 pt-1 mb-12 mt-24 space-y-2">
        {/* 첫 번째 줄: 회원탈퇴, 로그아웃 */}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              playSound(0);
              deactivateAccount();
            }}
            disabled={isLoading}
            className="hover:underline"
          >
            {isLoading ? "탈퇴 중..." : "회원탈퇴"}
          </button>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <span>|</span>
          <button
            onClick={() => {
              playSound(0);
              handleRemoveCookie();
            }}
          >
            로그아웃
          </button>
        </div>

        {/* 두 번째 줄: 개인정보처리방침 */}
        <div className="ml-2">
          <button
            onClick={() => {
              playSound(0);
              openModal();
            }}
            className="hover:underline"
          >
            개인정보처리방침
          </button>
        </div>

        {/* 개인정보처리방침 모달창 */}
        {isOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="p-4 flex flex-col h-96">
                <div className="flex-grow overflow-y-auto pr-2 scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <pre className="whitespace-pre-wrap break-words text-gray-700">
                    {policyText}
                  </pre>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      playSound(0);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-custom-violet text-white rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
