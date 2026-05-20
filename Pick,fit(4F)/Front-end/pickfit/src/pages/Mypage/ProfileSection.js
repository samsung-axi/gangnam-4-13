import "../../styles/MyPage.css";
// ProfileSection.js
const ProfileSection = ({ userName, email }) => (
    <div className="profile-container">
      <div className="profile-image-box">
        <img src="https://via.placeholder.com/100" alt="Profile" className="profile-image" />
      </div>
      <div className="profile-info">
        <p className="profile-name">{userName || "홍길동"}</p>
        <p className="profile-email">{email || "test@naver.com"}</p>
      </div>
    </div>
  );
  
  export default ProfileSection;
  