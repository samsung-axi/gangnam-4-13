interface UserInfo {
  access_token: string;
  user_id: number;
  profile_url: string;
  loginType: string;
  id: number;
  username: string;
}

// 쿠키 파싱 함수
export const parseCookieKeyValue = (
  inputString: string | null
): Partial<UserInfo> | null => {
  if (!inputString) {
    return null;
  }

  // 문자열 파싱 로직
  const cleanedString = inputString.replace(/[{}]/g, "").trim();
  const keyValueObj: Partial<UserInfo> = {};

  cleanedString.split(",+").forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      const trimmedKey = key.trim() as keyof UserInfo;
      const trimmedValue = value.trim();

      switch (trimmedKey) {
        case "user_id":
        case "id":
          keyValueObj[trimmedKey] = parseInt(trimmedValue, 10); // number로 변환
          break;
        default:
          keyValueObj[trimmedKey] = trimmedValue; // 기본적으로 string으로 처리
          break;
      }
    }
  });

  return keyValueObj;
};
