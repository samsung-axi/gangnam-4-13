import "../../styles/MyPage.css";
// Sidebar.js
const Sidebar = ({ activeSection, handleSectionClick }) => (
    <div>
      <h3 onClick={() => handleSectionClick("info")} className={activeSection === "info" ? "active" : ""}>내 정보 관리</h3>
      <hr className="border-line" />
      <h3 onClick={() => handleSectionClick("inquiries")} className={activeSection === "inquiries" ? "active" : ""}>문의사항</h3>
      <hr className="border-line" />
      <h3 onClick={() => handleSectionClick("notices")} className={activeSection === "notices" ? "active" : ""}>공지사항</h3>
      <hr className="border-line" />
      <h3 onClick={() => handleSectionClick("support")} className={activeSection === "support" ? "active" : ""}>고객센터</h3>
    </div>
  );
  
  export default Sidebar;
  