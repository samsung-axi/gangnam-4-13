import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(45, 17, 85, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div<{ $type?: 'success' | 'error' }>`
  background: white;
  padding: 60px 50px;
  border-radius: 24px;
  min-width: 480px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(45, 17, 85, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const IconContainer = styled.div<{ $type?: 'success' | 'error' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$type === 'error' 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #2d1155 0%, #4c1d95 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin: 0 auto 20px auto;
  box-shadow: ${props => props.$type === 'error' 
    ? '0 8px 25px rgba(239, 68, 68, 0.3)'
    : '0 8px 25px rgba(45, 17, 85, 0.3)'};
  animation: bounce 0.6s ease-out;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

export const Title = styled.h2<{ $type?: 'success' | 'error' }>`
  color: ${props => props.$type === 'error' ? '#ef4444' : '#2d1155'};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: ${props => props.$type === 'error' 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #2d1155 0%, #4c1d95 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Description = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
`;

export const ConfirmButton = styled.button<{ $type?: 'success' | 'error' }>`
  background: ${props => props.$type === 'error' 
    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    : 'linear-gradient(135deg, #2d1155 0%, #4c1d95 100%)'};
  color: #fff;
  padding: 16px 40px;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 80%;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$type === 'error' 
    ? '0 8px 20px rgba(239, 68, 68, 0.3)'
    : '0 8px 20px rgba(45, 17, 85, 0.3)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$type === 'error' 
      ? '0 12px 30px rgba(239, 68, 68, 0.4)'
      : '0 12px 30px rgba(45, 17, 85, 0.4)'};
    background: ${props => props.$type === 'error' 
      ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
      : 'linear-gradient(135deg, #1e0a3e 0%, #3b1771 100%)'};
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.$type === 'error' 
      ? '0 6px 15px rgba(239, 68, 68, 0.3)'
      : '0 6px 15px rgba(45, 17, 85, 0.3)'};
  }
`;
