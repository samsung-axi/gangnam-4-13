import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: 'Rethink Sans', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(45, 17, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(45, 17, 85, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 60px;
  border-radius: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 
    0 20px 40px rgba(45, 17, 85, 0.1),
    0 10px 20px rgba(45, 17, 85, 0.05);
  border: 1px solid rgba(45, 17, 85, 0.1);
  position: relative;
  z-index: 1;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #2d1155;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(45, 17, 85, 0.1);
    color: #4a1e75;
    transform: translateX(-2px);
  }
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #2d1155;
  margin-bottom: 40px;
  margin-top: 20px;
  text-shadow: 0 2px 4px rgba(45, 17, 85, 0.1);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid rgba(45, 17, 85, 0.1);
  border-radius: 12px;
  padding: 0 20px;
  height: 56px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  &:hover {
    border-color: rgba(45, 17, 85, 0.3);
  }
`;

export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  margin-right: 20px;
  font-weight: 600;
  color: #2d1155;
  font-size: 16px;
`;

export const StyledAsterisk = styled.span`
  color: #e74c3c;
  margin-left: 4px;
  font-weight: 700;
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #2d1155;
  font-weight: 500;

  &::placeholder {
    color: rgba(45, 17, 85, 0.5);
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.9) inset;
    -webkit-text-fill-color: #2d1155;
  }
`;

export const Select = styled.select`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: #2d1155;
  font-weight: 500;
  cursor: pointer;

  option {
    color: #2d1155;
    background: white;
  }
`;

export const SubmitButton = styled.button`
  height: 66px;
  border-radius: 15px;
  background: linear-gradient(135deg, #2d1155 0%, #4a1e75 100%);
  color: white;
  font-size: 18px;
  font-weight: 700;
  padding: 0 32px;
  border: none;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(45, 17, 85, 0.3);
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(45, 17, 85, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 15px rgba(45, 17, 85, 0.3);
  }
`;

export const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 15px;
  margin-left: 170px;
  padding: 8px 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 3px solid #e74c3c;
`;
