import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% { box-shadow: 0 0 8px 2px rgba(45, 17, 85, 0.4), 0 0 0 rgba(45, 17, 85, 0.1); }
  50% { box-shadow: 0 0 24px 8px rgba(45, 17, 85, 0.6), 0 0 8px 2px rgba(45, 17, 85, 0.3); }
  100% { box-shadow: 0 0 8px 2px rgba(45, 17, 85, 0.4), 0 0 0 rgba(45, 17, 85, 0.1); }
`;

const Banner = styled.div`
  position: fixed;
  right: 36px;
  bottom: 36px;
  z-index: 9999;
  min-width: 260px;
  max-width: 90vw;
  background: linear-gradient(135deg, #f8f5ff 0%, #e8e0ee 100%);
  color: #2d1155;
  font-weight: 600;
  font-size: 1.08rem;
  border-radius: 16px;
  padding: 13px 36px 13px 24px;
  box-shadow: 0 8px 32px rgba(45, 17, 85, 0.15), 0 2px 8px rgba(45, 17, 85, 0.1);
  cursor: pointer;
  border: 1.5px solid rgba(45, 17, 85, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 0.01em;
  transition: all 0.3s ease;
  animation: ${glow} 1.5s infinite alternate;
  user-select: none;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: linear-gradient(135deg, #e8e0ee 0%, #d4c7e8 100%);
    box-shadow: 0 12px 36px rgba(45, 17, 85, 0.25), 0 4px 16px rgba(45, 17, 85, 0.15);
    border: 2px solid rgba(45, 17, 85, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }
`;

const BannerText = styled.span`
  font-size: 1.08rem;
  font-weight: 600;
  color: #2d1155;
  letter-spacing: 0.01em;
  
  & > strong {
    color: #2d1155;
    font-weight: 700;
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 1px 2px rgba(45, 17, 85, 0.1);
  }
`;

const AlertDot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  box-shadow: 0 0 8px 2px rgba(45, 17, 85, 0.4), 0 0 4px rgba(45, 17, 85, 0.6);
  margin-left: 18px;
  animation: pulse 2s ease-in-out infinite;
  
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const AnalysisRequestedBanner = ({ onClick }: { onClick: () => void }) => (
  <Banner onClick={onClick}>
    <BannerText>
      <strong>예정된</strong> 회의가 있습니다.
    </BannerText>
    <AlertDot />
  </Banner>
);

export default AnalysisRequestedBanner; 