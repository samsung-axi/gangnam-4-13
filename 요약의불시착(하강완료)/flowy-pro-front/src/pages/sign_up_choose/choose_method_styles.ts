import styled from 'styled-components';

export const SignUpWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const SignUpContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 30px;
  width: 90%;
  max-width: 700px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

`;

export const LogoImg = styled.img`
  width: 140px;
  height: auto;
  margin-bottom: 30px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

export const SelectionTitle = styled.div`
  color: #351745;
  font-size: 20px;
  font-weight: 700;
  margin: 30px 0;
  position: relative;
  width: 100%;
  text-align: center;
  letter-spacing: -0.5px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 25%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, #351745 50%, transparent 100%);
  }

  &::before {
    left: 0;
    margin-left: 10%;
  }

  &::after {
    right: 0;
    margin-right: 10%;
  }
`;

export const SelectionOptions = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 30px;
  width: 100%;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

export const OptionCard = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 200px;
  border-radius: 20px;
  border: ${(props) => (props.$primary ? 'none' : '2px solid rgba(53, 23, 69, 0.2)')};
  background: ${(props) => 
    props.$primary 
      ? 'linear-gradient(135deg, #351745 0%, #480b6a 50%, #351745 100%)' 
      : 'rgba(255, 255, 255, 0.95)'};
  color: ${(props) => (props.$primary ? 'white' : '#351745')};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.3px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: ${(props) => 
    props.$primary 
      ? '0 12px 30px rgba(53, 23, 69, 0.25), 0 4px 12px rgba(53, 23, 69, 0.15)' 
      : '0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.06)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${(props) => 
      props.$primary 
        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)' 
        : 'linear-gradient(90deg, transparent, rgba(53, 23, 69, 0.08), transparent)'};
    transition: left 0.8s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => 
      props.$primary 
        ? 'transparent' 
        : 'linear-gradient(135deg, rgba(53, 23, 69, 0.03) 0%, transparent 50%)'};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 
      0 20px 40px ${(props) => 
        props.$primary 
          ? 'rgba(53, 23, 69, 0.35)' 
          : 'rgba(53, 23, 69, 0.15)'},
      0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => (props.$primary ? 'none' : 'rgba(72, 11, 106, 0.4)')};
    background: ${(props) => 
      props.$primary 
        ? 'linear-gradient(135deg, #480b6a 0%, #5d1780 50%, #480b6a 100%)' 
        : 'rgba(255, 255, 255, 1)'};

    &::before {
      left: 100%;
    }

    &::after {
      background: ${(props) => 
        props.$primary 
          ? 'transparent' 
          : 'linear-gradient(135deg, rgba(53, 23, 69, 0.05) 0%, transparent 50%)'};
    }
  }

  &:active {
    transform: translateY(-3px) scale(1.01);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
  transition: all 0.3s ease;

  ${OptionCard}:hover & {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.15);
  }

  ${OptionCard}[data-primary="false"]:hover & {
    background: rgba(53, 23, 69, 0.08);
  }
`;

export const MobileIcon = styled.img`
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  filter: brightness(1.1);

  ${OptionCard}:hover & {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
`;

export const GoogleIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;

  ${OptionCard}:hover & {
    transform: scale(1.1);
  }
`;

export const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.4px;
`;

export const CardSubtitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  letter-spacing: -0.2px;
`;
