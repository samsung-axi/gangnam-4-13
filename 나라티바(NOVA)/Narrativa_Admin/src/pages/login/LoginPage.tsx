import React from "react";
import useLogin from "../../hooks/useLogin";
import googleIcon from "../../assets/images/web_light_sq_SU.svg";

const LoginPage: React.FC = () => {
  const { handleLogin } = useLogin();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `url('/admin-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/75 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur">
        <h1 className="text-4xl font-title font-bold text-pointer text-center mb-4">
          NARRATIVA
        </h1>
        <h1 className="text-2xl font-contents font-bold text-center mb-4">
          관리자 로그인
        </h1>
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="flex items-center justify-center w-auto h-12"
          >
            <img
              src={googleIcon}
              alt="Google icon"
              className="w-auto h-auto mr-3"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
