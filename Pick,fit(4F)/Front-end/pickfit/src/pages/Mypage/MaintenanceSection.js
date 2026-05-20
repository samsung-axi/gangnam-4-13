// MaintenanceSection.js
import inspection from "../../images/inspection.png";

const MaintenanceSection = ({ message }) => {
  return (
    <div className="maintenance-section">
      <img src={inspection} alt="점검 중" className="maintenance-icon" />
      <h3 className="maintenance-text-large">점검 중이다</h3>
      <p className="maintenance-text-small">{message}</p>
    </div>
  );
};

export default MaintenanceSection;
