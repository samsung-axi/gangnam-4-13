import styled from 'styled-components';

export const MyPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  height: calc(100vh - 70px);
  max-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export const FormArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

export const PageTitle = styled.h1`
  color: #2d1155;
  font-size: 1.8rem;
  font-weight: 700;
  position: absolute;
  top: 15px;
  left: 20px;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px 25px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8fafc;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #2d1155;
    background-color: #f3f0ff;
    box-shadow: 0 0 0 4px rgba(45, 17, 85, 0.1);
  }
`;

export const Label = styled.label`
  color: #2d1155;
  font-weight: 600;
  flex-shrink: 0;
  width: 100px;
  padding: 20px 0 20px 20px;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  border: none;
  font-size: 1rem;
  flex-grow: 1;
  padding: 20px 20px 20px 10px;
  outline: none;
  background: transparent;
  color: #1e293b;

  &::placeholder {
    color: #94a3b8;
  }

  &:read-only {
    color: #64748b;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  color: #fff;
  padding: 18px 32px;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(45, 17, 85, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(45, 17, 85, 0.4);
    background: linear-gradient(135deg, #1e0a3e 0%, #3b1771 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 15px rgba(45, 17, 85, 0.3);
  }
`;

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin: -20px 0 0 0;
  padding: 12px 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
`;
