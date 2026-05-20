import React, { useEffect, useState } from 'react';
import type { User /*, UserUpdateRequest*/ } from '../../types/user';
import { fetchUserData, updateMypageUser } from '../../api/fetchMypage';

import InfoChangeModal from './mypage_popup/InfoChangeModal';
import {
  AlterInfoWrapper,
  ButtonContainer,
  ChangeButton,
  Container,
  ErrorText,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
} from './alterInfo.styles';

const AlterInfo: React.FC = () => {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    description: <></>,
    type: 'success' as 'success' | 'error',
  });
  const [mypageUser, setMypageUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    user_name: '',
    user_phonenum: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const closeModal = () => {
    setShowChangeModal(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editedData.user_name) newErrors.name = '이름을 입력해주세요.';

    if (!editedData.user_phonenum.match(/^\d+$/)) {
      newErrors.phone = '전화번호는 숫자만 입력해주세요.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // 변경내용 저장
  const handleButtonClick = async () => {
    if (!isEditing) {
      // 편집 모드로 진입할 때 기존 정보 세팅
      if (mypageUser) {
        setEditedData({
          user_name: mypageUser.user_name,
          user_phonenum: mypageUser.user_phonenum,
        });
      }
      setIsEditing(true);
      return;
    }

    // 편집 모드일 때만 API 호출

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      console.log('🟢 서버로 보낼 데이터:', editedData);
      const result = await updateMypageUser(editedData); // 이 API에서 모든 처리
      // user 객체에서 user_id, user_name, user_phonenum만 추출해서 새 객체로 출력
      const filteredUser =
        result && result.user
          ? {
              user_id: result.user.user_id,
              user_name: result.user.user_name,
              user_phonenum: result.user.user_phonenum,
            }
          : null;

      console.log('updateMypageUser 응답:', {
        message: result?.message,
        user: filteredUser,
      });

      if (result && result.user) {
        setIsEditing(false);
        setModalContent({
          title: '정보 변경이 완료되었습니다.',
          description: (
            <>
              변경하신 정보가 성공적으로 저장되었습니다.
              <br />
              새로운 정보가 즉시 적용됩니다.
            </>
          ),
          type: 'success',
        });
        setShowChangeModal(true);
      } else {
        setModalContent({
          title: '정보 변경에 실패했습니다',
          description: (
            <>
              입력하신 정보를 다시 확인해주세요.
              <br />
              문제가 지속되면 관리자에게 문의하세요.
            </>
          ),
          type: 'error',
        });
        setShowChangeModal(true);
      }
    } catch (e) {
      setModalContent({
        title: '서버 오류가 발생했습니다',
        description: (
          <>
            일시적인 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </>
        ),
        type: 'error',
      });
      setShowChangeModal(true);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserData();
        setMypageUser(data);
      } catch (err) {
        console.error('🚨 사용자 데이터 로딩 실패:', err);
      }
    };

    getUser();
  }, [isEditing]);

  return (
    <AlterInfoWrapper>
      <FormArea>
        <Container>
          <FormContainer>
            <InputGroup>
              <Label>
                이름{' '}
                {isEditing && (
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {' '}
                    (수정 가능)
                  </span>
                )}
              </Label>
              <Input
                type="text"
                name="user_name"
                value={
                  isEditing ? editedData.user_name : mypageUser?.user_name || ''
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
                placeholder={isEditing ? '새 이름을 입력하세요' : ''}
              />
            </InputGroup>
            {errors.name && <ErrorText>{errors.name}</ErrorText>}

            <InputGroup>
              <Label>이메일주소</Label>
              <Input
                type="email"
                value={mypageUser?.user_email || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                value={mypageUser?.user_login_id || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>
                휴대폰 번호{' '}
                {isEditing && (
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {' '}
                    (수정 가능)
                  </span>
                )}
              </Label>
              <Input
                type="text"
                name="user_phonenum"
                value={
                  isEditing
                    ? editedData.user_phonenum
                    : mypageUser?.user_phonenum || ''
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
                placeholder={isEditing ? '휴대폰 번호를 입력하세요' : ''}
              />
            </InputGroup>
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            <InputGroup>
              <Label>소속 회사명</Label>
              <Input
                type="text"
                value={mypageUser?.company_name || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 부서명</Label>
              <Input
                type="text"
                value={mypageUser?.user_dept_name || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 팀명</Label>
              <Input
                type="text"
                value={mypageUser?.user_team_name || ''}
                readOnly
              />
            </InputGroup>

            <ButtonContainer>
              <ChangeButton onClick={handleButtonClick}>
                {isEditing ? '변경내용 저장' : '정보 변경하기'}
              </ChangeButton>
            </ButtonContainer>
          </FormContainer>
        </Container>
      </FormArea>

      {showChangeModal && (
        <InfoChangeModal
          onClose={closeModal}
          title={modalContent.title}
          description={modalContent.description}
          type={modalContent.type}
        />
      )}
    </AlterInfoWrapper>
  );
};

export default AlterInfo;
