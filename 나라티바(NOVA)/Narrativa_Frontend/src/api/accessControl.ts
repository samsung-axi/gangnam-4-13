const AuthGuard = async (userId: number, accessToken: string) => {
  // 테스트용 인증 우회
  if (process.env.REACT_APP_BYPASS_AUTH === "true") {
    console.log("테스트 환경에서 인증을 우회합니다.");
    return true;
  }

  if (userId === undefined) {
    console.log("유저 아이디 타입이 undefined 입니다.");
    return false;
  }
  
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SPRING_URI}/api/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );
    // console.log('AuthGuard response: ', response);

    if (!response.ok) {
      return false;
    }
    return true;
  } catch (err: any) {
    console.log(err);
    return false;
  }
};

export default AuthGuard;
