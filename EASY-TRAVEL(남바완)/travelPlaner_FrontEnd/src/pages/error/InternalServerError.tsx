import { Link } from "react-router-dom";
import ShortBtn from "../../components/buttons/ShortBtn";

const InternalServerError = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "20px",
        gap: "20px",
      }}
    >
      <h1>500 서버 오류</h1>
      <img src="/public/icons/Easy_Travel.png" alt="500 서버 오류" />
      <p>죄송합니다. 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      <Link to="/">
        <ShortBtn content="홈으로 돌아가기" />
      </Link>
    </div>
  );
};

export default InternalServerError;
