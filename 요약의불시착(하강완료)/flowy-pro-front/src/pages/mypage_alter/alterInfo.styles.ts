import styled from 'styled-components';

export const AlterInfoWrapper = styled.div`
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

export const PageTitle = styled.h1`
  color: #2d1155;
  font-size: 2.2rem;
  font-weight: 700;
  position: absolute;
  top: 20px;
  left: 30px;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const FormArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-top: 60px;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
  box-sizing: border-box;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  background: white;
  padding: 40px 35px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(45, 17, 85, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 25px;
  margin-bottom: 8px;
`;

export const Label = styled.label`
  color: #2d1155;
  font-weight: 600;
  flex-shrink: 0;
  width: 180px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const Input = styled.input<{ isEditing?: boolean }>`
  border: 2px solid #f1f5f9;
  padding: 14px 18px;
  font-size: 1rem;
  outline: none;
  background: ${(props) =>
    props.isEditing ? '#f3f0ff' : '#f8fafc'};
  border-radius: 16px;
  flex: 1;
  transition: all 0.3s ease;
  color: ${(props) => (props.isEditing ? '#1e293b' : '#64748b')};
  
  &:focus {
    border-color: #2d1155;
    box-shadow: 0 0 0 4px rgba(45, 17, 85, 0.1);
    background: #f3f0ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:read-only {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(45, 17, 85, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(45, 17, 85, 0.4);
    background: linear-gradient(135deg, #1e0a3e 0%, #3b1771 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 30px;
`;

export const ChangeButton = styled.button`
  background: linear-gradient(135deg, #2d1155 0%, #4c1d95 100%);
  color: #fff;
  padding: 16px 42px;
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
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
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(45, 17, 85, 0.4);
    background: linear-gradient(135deg, #1e0a3e 0%, #3b1771 100%);
    
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
  color: #ef4444;
  font-size: 0.85rem;
  margin-left: 205px;
  margin-top: -8px;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  display: inline-block;
`;
