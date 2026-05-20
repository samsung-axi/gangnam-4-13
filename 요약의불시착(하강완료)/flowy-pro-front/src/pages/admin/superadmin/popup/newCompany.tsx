import React, { useState } from 'react';
import styled from 'styled-components';

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 3.5rem 3rem 2.5rem 3rem;
  border-radius: 36px;
  width: 100%;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid #351745;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  box-sizing: border-box;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2.2rem;
  h2 {
    margin: 0;
    font-size: 1.4rem;
    color: #351745;
    font-weight: 700;
  }
`;
const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 1100;
  background: none;
  border: none;
  font-size: 2.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  &:hover { color: #351745; }
`;
const Form = styled.form`
  background: none;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
`;
const InputBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  background: #fff;
  box-sizing: border-box;
  padding: 0 1.2rem;
`;
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  label {
    min-width: 100px;
    font-size: 1.08rem;
    color: #888;
    font-weight: 500;
    margin-right: 1.2rem;
    white-space: nowrap;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.1rem;
    color: #351745;
    font-weight: 500;
    height: 100%;
    padding: 0;
    margin: 0;
    &::placeholder {
      color: #b0b0b0;
      font-weight: 500;
    }
  }
`;
const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  width: 270px;
  height: 60px;
  border-radius: 2rem;
  background: #13c7c1;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2.2rem auto 0 auto;
  display: block;
  box-shadow: 0 6px 18px #13c7c133;
  border: none;
  transition: background 0.18s;
  cursor: pointer;
  &:hover { background: #0fa7a2; }
`;

interface NewCompanyProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    company_name: string;
    company_scale: string;
    service_startdate: string;
    service_enddate: string;
    service_status: boolean;
    admin_account?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 날짜를 yyyy-MM-dd로 변환하는 함수
const toDateInputValue = (dateString: string) => {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  return dateString.split('T')[0];
};

const NewCompany: React.FC<NewCompanyProps> = ({ visible, onClose, onSubmit, formData, onChange }) => {
  const [touched, setTouched] = useState({
    company_name: false,
    company_scale: false,
    service_startdate: false,
    service_enddate: false,
  });

  // 유효성 검사
  const errors = {
    company_name: !formData.company_name ? '회사명을 입력하세요.' : '',
    company_scale: !formData.company_scale ? '기업 규모를 입력하세요.' : '',
    service_startdate: !formData.service_startdate ? '시작일을 선택하세요.' : '',
    service_enddate:
      formData.service_enddate && formData.service_startdate &&
      formData.service_enddate < formData.service_startdate
        ? '종료일은 시작일 이후여야 합니다.'
        : '',
  };
  const isValid =
    !errors.company_name &&
    !errors.company_scale &&
    !errors.service_startdate &&
    !errors.service_enddate;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  return (
    <Modal $isOpen={visible}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <h2>신규 회사 등록</h2>
        </ModalHeader>
        <Form
          onSubmit={e => {
            e.preventDefault();
            if (isValid) {
              onSubmit(e);
              onClose();
            }
          }}
        >
          <FormGroup>
            <InputBox>
              <label htmlFor="company_name">회사명</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={onChange}
                onBlur={handleBlur}
                required
              />
            </InputBox>
            {touched.company_name && errors.company_name && (
              <div style={{ color: '#dc2626', fontSize: '0.95rem', marginTop: 4 }}>{errors.company_name}</div>
            )}
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label htmlFor="company_scale">기업 규모</label>
              <input
                type="text"
                id="company_scale"
                name="company_scale"
                value={formData.company_scale}
                onChange={onChange}
                onBlur={handleBlur}
                required
              />
            </InputBox>
            {touched.company_scale && errors.company_scale && (
              <div style={{ color: '#dc2626', fontSize: '0.95rem', marginTop: 4 }}>{errors.company_scale}</div>
            )}
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label htmlFor="service_startdate">서비스 시작일</label>
              <input
                type="date"
                id="service_startdate"
                name="service_startdate"
                value={toDateInputValue(formData.service_startdate)}
                onChange={onChange}
                onBlur={handleBlur}
                required
              />
            </InputBox>
            {touched.service_startdate && errors.service_startdate && (
              <div style={{ color: '#dc2626', fontSize: '0.95rem', marginTop: 4 }}>{errors.service_startdate}</div>
            )}
          </FormGroup>
          <FormGroup>
            <InputBox>
              <label htmlFor="service_enddate">서비스 종료일</label>
              <input
                type="date"
                id="service_enddate"
                name="service_enddate"
                value={toDateInputValue(formData.service_enddate)}
                onChange={onChange}
                onBlur={handleBlur}
              />
            </InputBox>
            {touched.service_enddate && errors.service_enddate && (
              <div style={{ color: '#dc2626', fontSize: '0.95rem', marginTop: 4 }}>{errors.service_enddate}</div>
            )}
          </FormGroup>
          <Button type="submit" disabled={!isValid}>등록</Button>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default NewCompany; 