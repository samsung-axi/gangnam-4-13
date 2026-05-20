import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Camera, LogOut, Save, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading, isAuthenticated, updateUser } = useAuthContext();
  const [profileData, setProfileData] = useState({
    nickname: '',
    name: '',
    gender: 'male',
    birthYear: '1990',
    email: '',
    nationality: 'korean',
    profileImage: null as File | null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  
  // 디버깅을 위한 profileImagePreview 변경 감지
  useEffect(() => {
    console.log('=== profileImagePreview 상태 변경 ===');
    console.log('New value:', profileImagePreview);
    console.log('Type:', typeof profileImagePreview);
    console.log('Is valid URL:', profileImagePreview && typeof profileImagePreview === 'string' && profileImagePreview.startsWith('http'));
  }, [profileImagePreview]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('=== 이미지 파일 선택 ===');
      console.log('파일명:', file.name);
      console.log('파일 크기:', file.size);
      console.log('파일 타입:', file.type);
      
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setIsImageUploading(true);
      setProfileData(prev => ({ ...prev, profileImage: file }));
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          console.log('미리보기 생성 성공');
          setProfileImagePreview(result);
          setIsImageUploading(false);
          toast.success('이미지가 선택되었습니다. 저장 버튼을 눌러 적용해주세요.');
        }
      };
      reader.onerror = () => {
        console.error('미리보기 생성 실패');
        setIsImageUploading(false);
        toast.error('이미지 로드에 실패했습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileData(prev => ({ ...prev, profileImage: null }));
    setProfileImagePreview('');
    toast.success('프로필 이미지가 제거되었습니다. 저장 버튼을 눌러 적용해주세요.');
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    // 닉네임은 선택사항이므로 검증에서 제외
    if (!profileData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!profileData.birthYear) newErrors.birthYear = '출생년도를 선택해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      console.log('=== 프로필 저장 시작 ===');
      console.log('Current profileImagePreview:', profileImagePreview);
      console.log('Current profileData:', {
        name: profileData.name,
        nickname: profileData.nickname,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        nationality: profileData.nationality,
        hasFile: !!profileData.profileImage,
        fileName: profileData.profileImage?.name,
        fileSize: profileData.profileImage?.size
      });
      
      // 업데이트할 사용자 정보
      const updatedUserData: any = {};
      
      if (profileData.name?.trim()) updatedUserData.name = profileData.name.trim();
      // 닉네임은 빈 값이어도 전송 (백엔드에서 처리)
      updatedUserData.nickname = profileData.nickname?.trim() || '';
      if (profileData.gender) updatedUserData.gender = profileData.gender;
      if (profileData.birthYear) updatedUserData.birthYear = profileData.birthYear;
      if (profileData.nationality) updatedUserData.nationality = profileData.nationality;
      if (profileData.profileImage) {
        updatedUserData.profileImage = profileData.profileImage;
        toast.info('프로필 이미지를 업로드하고 있습니다...');
      }
      
      console.log('전송할 데이터:', {
        ...updatedUserData,
        profileImage: !!updatedUserData.profileImage ? {
          name: updatedUserData.profileImage.name,
          size: updatedUserData.profileImage.size,
          type: updatedUserData.profileImage.type
        } : 'None'
      });
      
      // 백엔드 API 호출
      const response = await authService.updateProfile(updatedUserData);
      
      console.log('=== API 응답 성공 ===');
      console.log('Response:', response);
      
      if (response.success) {
        console.log('=== 프로필 업데이트 성공 ===');
        console.log('Response data:', response.data);
        console.log('Profile image from response:', response.data.profileImage);
        console.log('Profile image URL from response:', response.data.profileImageUrl);
        
        // AuthContext의 사용자 정보 업데이트
        const updatedProfileImage = response.data.profileImage || response.data.profileImageUrl;
        console.log('최종 사용할 프로필 이미지 URL:', updatedProfileImage);
        
        // 프로필 이미지 URL 검증
        if (updatedProfileImage && updatedProfileImage.startsWith('http')) {
          console.log('✅ 올바른 URL 형식:', updatedProfileImage);
        } else {
          console.error('❌ 잘못된 URL 형식:', updatedProfileImage);
          console.error('Type:', typeof updatedProfileImage);
          console.error('Length:', updatedProfileImage?.length);
        }
        
        updateUser({
          name: response.data.name,
          nickname: response.data.nickname,
          gender: response.data.gender,
          birthYear: response.data.birthYear,
          nationality: response.data.nationality,
          profileImage: updatedProfileImage,
        });
        
        // 현재 상태도 업데이트 (프로필 이미지 파일 초기화)
        setProfileData(prev => ({ ...prev, profileImage: null }));
        
        // 새 이미지 URL로 미리보기 업데이트
        if (updatedProfileImage && updatedProfileImage.startsWith('http')) {
          console.log('프로필 이미지 미리보기 업데이트:', updatedProfileImage);
          
          // 캐시 무효화를 위해 타임스탬프 추가
          const imageUrlWithTimestamp = `${updatedProfileImage}?t=${Date.now()}`;
          console.log('캐시 무효화된 URL:', imageUrlWithTimestamp);
          
          // 이미지 로드 테스트
          const img = new Image();
          img.onload = () => {
            console.log('✅ 이미지 로드 성공:', imageUrlWithTimestamp);
            setProfileImagePreview(imageUrlWithTimestamp);
          };
          img.onerror = (e) => {
            console.error('❌ 이미지 로드 실패:', imageUrlWithTimestamp);
            console.error('Error details:', e);
            // 원본 URL로 다시 시도
            setProfileImagePreview(updatedProfileImage);
          };
          img.src = imageUrlWithTimestamp;
        } else {
          console.log('프로필 이미지가 응답에 없음');
        }
        
        toast.success('프로필이 성공적으로 저장되었습니다.');
      } else {
        console.error('=== API 응답 실패 ===');
        console.error('Response:', response);
        toast.error('프로필 저장에 실패했습니다.');
      }
      
    } catch (error: any) {
      console.error('=== 프로필 저장 에러 ===');
      console.error('Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Config:', error.config);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '프로필 저장에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('로그아웃 시작...');
      await logout();
      console.log('로그아웃 완료');
      toast.success('로그아웃되었습니다.');
      
      // 즉시 홈으로 이동 (replace: true로 히스토리 교체)
      console.log('홈으로 이동...');
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다.');
      // 로그아웃 실패해도 홈으로 이동
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // AuthContext에서 실제 사용자 데이터 사용
    if (user) {
      setProfileData({
        nickname: user.nickname || '',
        name: user.name || '',
        gender: user.gender || 'male',
        birthYear: user.birthYear || '1990',
        email: user.email || '',
        nationality: user.nationality || 'korean',
        profileImage: null,
      });
      
      // 프로필 이미지 URL이 있으면 미리보기 설정
      if (user.profileImage) {
        setProfileImagePreview(user.profileImage);
        
        // 외부 이미지인지 확인하고 사용자에게 알림
        const isExternalImage = user.profileImage && (
          user.profileImage.includes('phinf.pstatic.net') ||
          user.profileImage.includes('googleusercontent.com') ||
          user.profileImage.includes('kakaocdn.net') ||
          !user.profileImage.startsWith('http://localhost:8081')
        );
        
        if (isExternalImage) {
          console.warn('외부 소셜 이미지 감지:', user.profileImage);
          // 외부 이미지 사용자에게 알림 (한 번만)
          const hasShownExternalImageNotice = sessionStorage.getItem('externalImageNoticeShown');
          if (!hasShownExternalImageNotice) {
            setTimeout(() => {
              toast.info('소셜 로그인 프로필 이미지는 CORS 정책으로 인해 표시되지 않을 수 있습니다. 새로운 프로필 이미지를 업로드해 주세요.', {
                duration: 8000,
                position: 'top-center'
              });
              sessionStorage.setItem('externalImageNoticeShown', 'true');
            }, 2000);
          }
        }
      }
    }
  }, [user, isLoading, isAuthenticated, navigate]);

  // 로딩 중이거나 사용자 정보가 없는 경우
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <Typography variant="body" className="text-gray-600">로딩 중...</Typography>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h3" className="text-black mb-4">사용자 정보를 찾을 수 없습니다</Typography>
          <Button onClick={() => navigate('/')}>홈으로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="default">
        <Container size="sm" className="max-w-md">
          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <Typography variant="h3" className="text-black">프로필</Typography>
            <Typography variant="body" className="text-gray-600">개인정보를 관리하세요</Typography>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-gray-300 relative">
                {isImageUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : profileImagePreview && typeof profileImagePreview === 'string' && 
                     (profileImagePreview.startsWith('http') || profileImagePreview.startsWith('data:')) ? (
                  <>
                    <img 
                      src={profileImagePreview} 
                      alt="프로필" 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.error('=== 이미지 로드 에러 상세 ===');
                        console.error('URL:', profileImagePreview);
                        console.error('Error event:', e);
                        console.error('Image natural width:', e.currentTarget.naturalWidth);
                        console.error('Image natural height:', e.currentTarget.naturalHeight);
                        console.error('Image complete:', e.currentTarget.complete);
                        
                        // 외부 이미지 (OAuth 프로바이더)인 경우 즉시 기본 아이콘 표시
                        const isExternalImage = profileImagePreview && (
                          profileImagePreview.includes('phinf.pstatic.net') ||
                          profileImagePreview.includes('googleusercontent.com') ||
                          profileImagePreview.includes('kakaocdn.net') ||
                          !profileImagePreview.startsWith('http://localhost:8081')
                        );
                        
                        if (isExternalImage) {
                          console.warn('외부 이미지 CORS 에러 - 기본 아이콘 표시');
                          e.currentTarget.style.display = 'none';
                          const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallbackDiv) {
                            fallbackDiv.style.display = 'flex';
                          }
                          return;
                        }
                        
                        // 로컬 이미지인 경우에만 재시도
                        console.log('로컬 이미지 로드 실패 - 재시도');
                        setTimeout(() => {
                          if (e.currentTarget && profileImagePreview) {
                            console.log('이미지 재로드 시도:', profileImagePreview);
                            try {
                              e.currentTarget.src = profileImagePreview + '?t=' + Date.now();
                            } catch (error) {
                              console.error('재로드 시도 중 에러:', error);
                            }
                          }
                        }, 1000);
                        
                        // 3초 후에도 로드되지 않으면 숨김
                        setTimeout(() => {
                          if (e.currentTarget && (!e.currentTarget.complete || e.currentTarget.naturalWidth === 0)) {
                            console.error('이미지 로드 최종 실패, 기본 아이콘 표시');
                            e.currentTarget.style.display = 'none';
                            const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallbackDiv) {
                              fallbackDiv.style.display = 'flex';
                            }
                          }
                        }, 3000);
                      }}
                      onLoad={() => {
                        console.log('✅ 이미지 로드 완료:', profileImagePreview);
                        console.log('Natural dimensions:', {
                          width: (event?.target as HTMLImageElement)?.naturalWidth,
                          height: (event?.target as HTMLImageElement)?.naturalHeight
                        });
                      }}
                    />
                    {/* 이미지 로드 실패 시 표시될 기본 아이콘 */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{display: 'none'}}>
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>
              
              {/* 이미지 업로드 버튼 */}
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 rounded-full w-10 h-10 bg-black text-white hover:bg-gray-800 shadow-lg"
                onClick={() => document.getElementById('profile-image')?.click()}
                disabled={isImageUploading}
              >
                <Camera className="w-5 h-5" />
              </Button>
              
              {/* 이미지 제거 버튼 */}
              {profileImagePreview && (
                <Button
                  size="icon"
                  className="absolute -top-1 -right-1 rounded-full w-8 h-8 bg-red-500 text-white hover:bg-red-600 shadow-lg"
                  onClick={handleRemoveImage}
                  disabled={isImageUploading}
                >
                  ×
                </Button>
              )}
              
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isImageUploading}
              />
            </div>
          </div>
          
          {/* 이미지 업로드 안내 */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              JPG, PNG 파일만 업로드 가능 (최대 5MB)
            </p>
            {profileImagePreview && (
              profileImagePreview.includes('phinf.pstatic.net') ||
              profileImagePreview.includes('googleusercontent.com') ||
              profileImagePreview.includes('kakaocdn.net') ||
              !profileImagePreview.startsWith('http://localhost:8081')
            ) && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ 소셜 로그인 이미지는 보안 정책으로 표시되지 않을 수 있습니다
              </p>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Nickname (선택사항) */}
              <div className="space-y-2">
                <Label htmlFor="nickname">
                  닉네임 <span className="text-gray-500 text-sm">(선택사항)</span>
                </Label>
                <Input
                  id="nickname"
                  name="nickname"
                  value={profileData.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요 (비워두면 아이디를 사용)"
                  className="border-gray-300 focus:border-black"
                />
                <Typography variant="caption" className="text-gray-500">
                  닉네임을 입력하지 않으면 아이디가 표시됩니다.
                </Typography>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  className={errors.name ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                />
                {errors.name && <Typography variant="caption" className="text-red-600">{errors.name}</Typography>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>성별</Label>
                <Select value={profileData.gender} onValueChange={handleSelectChange('gender')}>
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Year */}
              <div className="space-y-2">
                <Label>출생년도</Label>
                <Select value={profileData.birthYear} onValueChange={handleSelectChange('birthYear')}>
                  <SelectTrigger>
                    <SelectValue placeholder="출생년도를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.birthYear && <Typography variant="caption" className="text-red-600">{errors.birthYear}</Typography>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
                <Typography variant="caption" className="text-gray-600">이메일은 변경할 수 없습니다</Typography>
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <Label>국적</Label>
                <Select value={profileData.nationality} onValueChange={handleSelectChange('nationality')}>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="korean">대한민국</SelectItem>
                    <SelectItem value="american">미국</SelectItem>
                    <SelectItem value="chinese">중국</SelectItem>
                    <SelectItem value="japanese">일본</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                size="lg"
                className="w-full h-12 text-lg bg-black text-white font-sans border-2 border-transparent hover:bg-white hover:text-black hover:border-black
                relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <Save className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">저장하기</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="w-full h-12 text-lg font-sans bg-white border-2 border-black text-black relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden
                hover:bg-black hover:text-white hover:border-black
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <LogOut className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">로그아웃</span>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Profile;
