import styled from 'styled-components';

export const LoginContainer = styled.div`
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

export const LoginFormContainer = styled.form`
  max-width: 500px;
  width: 90%;
  padding: 40px;
  text-align: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

`;

// const LogoImg = styled.img`
//   width: 120px;
//   height: auto;
//   margin-bottom: 20px;
// `;

export const InputGroup = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  border: 2px solid rgba(72, 11, 106, 0.15);
  border-radius: 12px;
  background: rgba(248, 249, 250, 0.8);
  padding: 0px 20px;
  height: 70px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(72, 11, 106, 0.05), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    border-color: rgba(72, 11, 106, 0.25);
    background: rgba(248, 249, 250, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(72, 11, 106, 0.1);

    &::before {
      left: 100%;
    }
  }

  &:focus-within {
    border-color: #480b6a;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(72, 11, 106, 0.1);
  }
`;

export const InputLabel = styled.label`
  color: #480b6a;
  font-size: 15px;
  font-weight: 600;
  width: 80px;
  flex-shrink: 0;
  text-align: left;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0px;
  border-radius: 0px;
  border: none;
  background: transparent;
  font-size: 16px;
  box-sizing: border-box;
  color: #333;
  font-weight: 500;
  flex-grow: 1;
  height: 100%;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(72, 11, 106, 0.4);
    font-weight: 400;
  }

  &:focus {
    color: #480b6a;
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 13px;
  margin: 12px 0;
  text-align: center;
  background: rgba(231, 76, 60, 0.08);
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 8px;
  padding: 12px;
  animation: slideInShake 0.5s ease-out;

  @keyframes slideInShake {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    50% {
      opacity: 1;
      transform: translateY(0);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export const LoginButton = styled.button`
  display: flex;
  height: 60px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: 12px;
  background: linear-gradient(135deg, #480b6a 0%, #5d1780 50%, #480b6a 100%);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(72, 11, 106, 0.3);
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
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5d1780 0%, #73209a 50%, #5d1780 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(72, 11, 106, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const GoogleLoginButton = styled.button`
  width: 100%;
  height: 60px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid rgba(72, 11, 106, 0.15);
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  &:hover {
    border-color: rgba(72, 11, 106, 0.3);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(72, 11, 106, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  margin-top: 20px;

  a {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      color: #480b6a;
      background: rgba(72, 11, 106, 0.05);
      text-decoration: none;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 0;
      height: 2px;
      background: #480b6a;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 80%;
    }
  }

  span {
    color: rgba(102, 102, 102, 0.5);
    font-weight: 300;
  }
`;
