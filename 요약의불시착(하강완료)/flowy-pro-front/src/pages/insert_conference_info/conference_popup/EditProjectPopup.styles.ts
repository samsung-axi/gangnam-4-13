import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const ErrorMessageBox = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  padding: 16px 20px;
  border-radius: 12px;
  margin: 16px 0;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid #f87171;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
  font-family: 'Rethink Sans', sans-serif;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 25px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

export const RoleSelect = styled.select`
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 0.9rem;
  background: white;
  color: #374151;
  font-family: 'Rethink Sans', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
  }
`;

export const UserListBox = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  overflow-y: auto;
  padding: 8px;
  flex-grow: 1;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #00b4ba;
  }
`;

export const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  color: #374151;
  box-sizing: border-box;
  font-family: 'Rethink Sans', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #00b4ba;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const SearchResultsContainer = styled.div`
  overflow-y: auto;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  flex-grow: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const SearchResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateY(-1px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const UserName = styled.span`
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
  font-family: 'Rethink Sans', sans-serif;
`;

export const SelectedUsersContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectedUsersTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-align: right;
  font-family: 'Rethink Sans', sans-serif;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 16px;
  border-radius: 14px;
  border: 2px solid #e5e7eb;
  flex-grow: 1;
  align-content: flex-start;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const SelectedUserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 14px;
  background: linear-gradient(135deg, #00b4ba 0%, #00939a 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 180, 186, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 180, 186, 0.3);
  }

  ${UserName} {
    color: white;
    font-weight: 500;
  }
`;

export const RemoveButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
  padding: 4px 6px;
  border-radius: 50%;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

export const NoResultsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  font-family: 'Rethink Sans', sans-serif;
  font-style: italic;
`;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: translateY(-1px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, #00b4ba 0%, #00939a 100%);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 180, 186, 0.2);

  &:hover {
    background: linear-gradient(135deg, #009ca2 0%, #007b82 100%);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 180, 186, 0.3);
  }

  &:active {
    transform: translateY(0) scale(1);
  }
`;

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const PopupContent = styled.div`
  position: relative;
  background: white;
  padding: 0;
  border-radius: 24px;
  width: 520px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 180, 186, 0.15);
  border: 1px solid rgba(0, 180, 186, 0.1);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease-out;
`;

export const PopupHeader = styled.div`
  background: linear-gradient(135deg, #00b4ba 0%, #00939a 100%);
  color: white;
  padding: 32px 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

export const ProjectIcon = styled.img`
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
`;

export const PopupTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'Rethink Sans', sans-serif;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
  width: 100%;
`;

export const UserManagementContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 1rem;
`;

export const UserPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 280px;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 600;
  font-family: 'Rethink Sans', sans-serif;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Rethink Sans', sans-serif;
  background: white;
  color: #374151;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #00b4ba;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Rethink Sans', sans-serif;
  box-sizing: border-box;
  height: 120px;
  resize: none;
  background: white;
  color: #374151;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00b4ba;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 180, 186, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: #00b4ba;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const CreateProjectButton = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #00b4ba 0%, #00939a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Rethink Sans', sans-serif;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 180, 186, 0.2);

  &:hover {
    background: linear-gradient(135deg, #009ca2 0%, #007b82 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 180, 186, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PopupBody = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 24px;
`; 