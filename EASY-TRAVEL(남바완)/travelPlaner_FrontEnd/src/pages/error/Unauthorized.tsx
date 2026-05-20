import { Link } from "react-router-dom";
import ShortBtn from "../../components/buttons/ShortBtn";

const Unauthorized = () => {
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
      <img src="/icons/Easy_Travel.png" alt="403 오류" />
      <p>잘못된 요청입니다.</p>
      <Link to="/">
        <ShortBtn content="홈으로 돌아가기" />
      </Link>
    </div>
  );
};

export default Unauthorized;
