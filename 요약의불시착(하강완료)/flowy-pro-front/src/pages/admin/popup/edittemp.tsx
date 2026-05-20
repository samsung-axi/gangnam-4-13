import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiEdit3, FiFile, FiUpload, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

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

const Modal = styled.div<{ $visible: boolean }>`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.15);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  color: white;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  font-size: 32px;
  color: white;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 40px;
  overflow-y: auto;
  max-height: 60vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: 'Rethink Sans', sans-serif;

  &:hover {
    border-color: #2d1155;
  }

  &:focus {
    outline: none;
    border-color: #2d1155;
    box-shadow: 0 0 0 3px rgba(45, 17, 85, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 48px;

  &:hover {
    border-color: #2d1155;
    background: #f3f4f6;
  }

  &.has-file {
    border-style: solid;
    border-color: #2d1155;
    background: rgba(45, 17, 85, 0.05);
  }
`;

const FileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const FileInputContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const FileIcon = styled.div`
  font-size: 20px;
  color: #6b7280;
`;

const FileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FileLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'Rethink Sans', sans-serif;
`;

const FileHint = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-family: 'Rethink Sans', sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          }
        `;
      case 'secondary':
        return `
          background: #f8fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
          
          &:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
            background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// 확인 모달 스타일
const ConfirmModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ConfirmModalBox = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(45, 17, 85, 0.2);
  border: 1px solid rgba(45, 17, 85, 0.1);
  animation: ${slideUp} 0.3s ease-out;
`;

const ConfirmHeader = styled.div<{ variant?: 'update' | 'delete' }>`
  color: white;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  ${props => props.variant === 'delete' ? `
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  ` : `
    background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
  `}
`;

const ConfirmIconWrapper = styled.div`
  font-size: 24px;
  color: white;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const ConfirmBody = styled.div`
  padding: 32px;
  text-align: center;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #374151;
  line-height: 1.5;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ConfirmButton = styled.button<{ variant?: 'cancel' | 'update' | 'delete' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  min-width: 100px;

  ${props => {
    switch (props.variant) {
      case 'update':
        return `
          background: linear-gradient(135deg, #2d1155 0%, #4b2067 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(45, 17, 85, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(45, 17, 85, 0.4);
            background: linear-gradient(135deg, #351745 0%, #5d2b7a 100%);
          }
        `;
      case 'delete':
        return `
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          
          &:hover {
            background: #e5e7eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

interface Template {
  interdocs_id: string;
  interdocs_type_name: string;
  interdocs_filename: string;
  interdocs_contents: string;
  interdocs_path: string;
  interdocs_uploaded_date: string;
  interdocs_updated_date?: string;
  interdocs_update_user_id: string;
}

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (e: React.FormEvent) => void;
  onDelete: () => void;
  selectedTemplate: Template | null;
  editDocType: string;
  setEditDocType: (v: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  selectedTemplate,
  editDocType,
  setEditDocType,
  handleFileChange,
}) => {
  const [confirmType, setConfirmType] = useState<'update' | 'delete' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpdateClick = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmType('update');
  };

  const handleDeleteClick = () => {
    setConfirmType('delete');
  };

  const handleConfirmUpdate = () => {
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    onUpdate(fakeEvent);
    setConfirmType(null);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setConfirmType(null);
  };

  const handleConfirmCancel = () => {
    setConfirmType(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    handleFileChange(e);
  };

  return (
    <>
      <Modal $visible={isOpen}>
        <ModalContent>
          <ModalHeader>
            <HeaderContent>
              <IconWrapper>
                <FiEdit3 />
              </IconWrapper>
              <Title>템플릿 수정</Title>
            </HeaderContent>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <Form onSubmit={handleUpdateClick}>
              <FormGroup>
                <Label htmlFor="doc_type">문서 양식</Label>
                <InputContainer>
                  <Input
                    type="text"
                    id="doc_type"
                    name="doc_type"
                    value={editDocType}
                    onChange={(e) => setEditDocType(e.target.value)}
                    placeholder="문서 양식명을 입력하세요"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="file">템플릿 파일</Label>
                <FileInputContainer>
                  <FileInputWrapper className={selectedFile ? 'has-file' : ''}>
                    <FileInput
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileInputChange}
                      accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf"
                    />
                    <FileInputContent>
                      <FileIcon>
                        {selectedFile ? <FiFile /> : <FiUpload />}
                      </FileIcon>
                      <FileText>
                        <FileLabel>
                          {selectedFile 
                            ? selectedFile.name 
                            : selectedTemplate?.interdocs_filename || '파일을 선택하세요'
                          }
                        </FileLabel>
                        <FileHint>
                          .doc, .docx, .ppt, .pptx, .xls, .xlsx, .pdf 파일만 업로드 가능
                        </FileHint>
                      </FileText>
                    </FileInputContent>
                  </FileInputWrapper>
                </FileInputContainer>
              </FormGroup>

              <ButtonContainer>
                <Button type="button" variant="secondary" onClick={onClose}>
                  취소
                </Button>
                <Button type="submit">
                  <FiEdit3 />
                  수정
                </Button>
                <Button type="button" variant="danger" onClick={handleDeleteClick}>
                  <FiTrash2 />
                  삭제
                </Button>
              </ButtonContainer>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 수정 확인 모달 */}
      {confirmType === 'update' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="update">
              <ConfirmIconWrapper>
                <FiEdit3 />
              </ConfirmIconWrapper>
              <ConfirmTitle>템플릿 수정</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{editDocType}</strong> 템플릿을 수정하시겠습니까?
                <br />
                기존 템플릿은 새로운 내용으로 덮어씌워집니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="update" onClick={handleConfirmUpdate}>
                  수정
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}

      {/* 삭제 확인 모달 */}
      {confirmType === 'delete' && (
        <ConfirmModalBg>
          <ConfirmModalBox>
            <ConfirmHeader variant="delete">
              <ConfirmIconWrapper>
                <FiAlertTriangle />
              </ConfirmIconWrapper>
              <ConfirmTitle>템플릿 삭제</ConfirmTitle>
            </ConfirmHeader>
            <ConfirmBody>
              <ConfirmMessage>
                <strong>{selectedTemplate?.interdocs_type_name}</strong> 템플릿을 정말 삭제하시겠습니까?
                <br />
                삭제된 템플릿은 복구할 수 없습니다.
              </ConfirmMessage>
              <ConfirmButtons>
                <ConfirmButton variant="cancel" onClick={handleConfirmCancel}>
                  취소
                </ConfirmButton>
                <ConfirmButton variant="delete" onClick={handleConfirmDelete}>
                  삭제
                </ConfirmButton>
              </ConfirmButtons>
            </ConfirmBody>
          </ConfirmModalBox>
        </ConfirmModalBg>
      )}
    </>
  );
};

export default EditTemplateModal;
