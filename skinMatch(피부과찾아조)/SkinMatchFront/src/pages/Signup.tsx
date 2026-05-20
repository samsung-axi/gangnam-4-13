import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import SocialLogin from '@/components/auth/SocialLogin';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    nickname: '', // 닉네임 추가
    emailLocal: '', // 이메일 로컬 부분 (@ 앞)
    emailDomain: 'gmail.com', // 이메일 도메인 부분
    customDomain: '', // 직접 입력 도메인
    password: '',
    confirmPassword: '',
    postcode: '',      // 우편번호
    roadAddress: '',   // 도로명주소
    jibunAddress: '',  // 지번주소
    detailAddress: '', // 상세주소
    extraAddress: ''   // 참고항목
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 다음 우편번호 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소 검색 함수
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        let roadAddr = data.roadAddress;
        let extraRoadAddr = '';

        if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
          extraRoadAddr += data.bname;
        }
        if(data.buildingName !== '' && data.apartment === 'Y'){
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        if(extraRoadAddr !== ''){
          extraRoadAddr = ' (' + extraRoadAddr + ')';
        }

        setFormData(prev => ({
          ...prev,
          postcode: data.zonecode,
          roadAddress: roadAddr,
          jibunAddress: data.jibunAddress,
          extraAddress: extraRoadAddr
        }));
        
        // 상세주소 입력 필드로 포커스
        setTimeout(() => {
          document.getElementById('detailAddress')?.focus();
        }, 100);
      }
    }).open();
  };

  // 전체 주소 조합
  const getFullAddress = () => {
    const parts = [
      formData.roadAddress,
      formData.detailAddress,
      formData.extraAddress
    ].filter(part => part.trim());
    
    return parts.join(' ');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.email || errors.address) {
      setErrors(prev => ({ ...prev, [name]: '', email: '', address: '' }));
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      emailDomain: value,
      customDomain: value === 'custom' ? '' : prev.customDomain // custom 선택 시 기존 값 유지
    }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, customDomain: e.target.value }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  // 전체 이메일 조합 (수정)
  const getFullEmail = () => {
    if (!formData.emailLocal) return '';
    
    const domain = formData.emailDomain === 'custom' 
      ? formData.customDomain 
      : formData.emailDomain;
      
    return domain ? `${formData.emailLocal}@${domain}` : '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Za-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    } else if (formData.username.length < 3) {
      newErrors.username = '아이디는 3자 이상이어야 합니다';
    }
    
    const fullEmail = getFullEmail();
    if (!formData.emailLocal.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(fullEmail)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (!formData.roadAddress.trim()) {
      newErrors.address = '주소를 검색해주세요';
    }
    // 상세주소는 선택사항이므로 검증에서 제외
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // 전송할 데이터 구성
        const signupData = {
          username: formData.username,
          nickname: formData.nickname.trim() || formData.username, // 닉네임이 없으면 username 사용
          email: getFullEmail(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          address: getFullAddress() // 전체 주소 조합해서 전송
        };
        
        const response = await authService.signup(signupData);
        if (response.success) {
          toast.success('회원가입이 완료되었습니다!');
          navigate('/login');
        } else {
          toast.error(response.message || '회원가입에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('회원가입 실패:', error);
        
        let errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          '회원가입에 실패했습니다.';
        
        // 사용자 친화적인 에러 메시지 변환
        if (errorMessage.includes('Duplicate entry') && errorMessage.includes('username')) {
          errorMessage = '이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.';
          setErrors(prev => ({ ...prev, username: '이미 사용중인 아이디입니다.' }));
        } else if (errorMessage.includes('이미 사용중인 이메일') || errorMessage.includes('email')) {
          errorMessage = '이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요.';
          setErrors(prev => ({ ...prev, email: '이미 사용중인 이메일입니다.' }));
        }
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[a-z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    
    if (score <= 2) return { score, text: '약함', color: 'text-black' };
    if (score <= 3) return { score, text: '보통', color: 'text-black' };
    return { score, text: '강함', color: 'text-black' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 pt-24">
      <div className="w-full max-w-md">

        <Card className="liquid-glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black">회원가입</CardTitle>
            <p className="text-black">새 계정을 만들어 서비스를 시작하세요</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* 아이디 */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-black">아이디</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="아이디를 입력하세요"
                    className={`bg-white text-black border ${errors.username ? 'border-black' : 'border-black'}`}
                  />
                  {errors.username && (
                    <p className="text-sm text-black">{errors.username}</p>
                  )}
                </div>

                {/* 닉네임 (선택사항) */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-black">
                    닉네임 <span className="text-gray-500 text-sm">(선택사항)</span>
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    type="text"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요 (비워두면 아이디를 사용)"
                    className="bg-white text-black border border-black"
                  />
                  <p className="text-xs text-gray-500">
                    닉네임을 입력하지 않으면 아이디가 닉네임으로 사용됩니다.
                  </p>
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label className="text-black">이메일</Label>
                  <div className="flex gap-2">
                    <Input
                      name="emailLocal"
                      type="text"
                      value={formData.emailLocal}
                      onChange={handleInputChange}
                      placeholder="이메일 아이디"
                      className={`bg-white text-black border ${errors.email ? 'border-red-500' : 'border-black'} flex-1`}
                    />
                    <span className="flex items-center text-black">@</span>
                    <select
                      value={formData.emailDomain}
                      onChange={handleDomainChange}
                      className="bg-white text-black border border-black rounded-md px-3 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="gmail.com">gmail.com</option>
                      <option value="naver.com">naver.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="kakao.com">kakao.com</option>
                      <option value="yahoo.com">yahoo.com</option>
                      <option value="hotmail.com">hotmail.com</option>
                      <option value="outlook.com">outlook.com</option>
                      <option value="custom">직접 입력</option>
                    </select>
                  </div>
                  
                  {/* 직접 입력 필드 */}
                  {formData.emailDomain === 'custom' && (
                    <Input
                      name="customDomain"
                      type="text"
                      value={formData.customDomain}
                      onChange={handleCustomDomainChange}
                      placeholder="도메인을 입력하세요 (예: company.com)"
                      className="bg-white text-black border border-black"
                    />
                  )}
                  
                  {formData.emailLocal && (
                    <p className="text-xs text-gray-600">
                      전체 이메일: {getFullEmail()}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 입력하세요"
                      className={`bg-white text-black border pr-10 ${errors.password ? 'border-black' : 'border-black'}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-black rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-black">{errors.password}</p>
                  )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black">비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      className={`bg-white text-black border pr-10 ${errors.confirmPassword ? 'border-black' : 'border-black'}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-black"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password && (
                    <div className="flex items-center gap-2">
                      {formData.password === formData.confirmPassword ? (
                        <Check className="w-4 h-4 text-black" />
                      ) : (
                        <X className="w-4 h-4 text-black" />
                      )}
                      <span className="text-sm text-black">
                        {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                      </span>
                    </div>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-sm text-black">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* 주소 */}
                <div className="space-y-2">
                  <Label className="text-black">주소</Label>
                  
                  {/* 우편번호 + 검색 버튼 */}
                  <div className="flex gap-2">
                    <Input
                      name="postcode"
                      type="text"
                      value={formData.postcode}
                      placeholder="우편번호"
                      className="bg-white text-black border border-black flex-1"
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={handleAddressSearch}
                      className="bg-white border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-md whitespace-nowrap"
                    >
                      주소검색
                    </Button>
                  </div>
                  
                  {/* 도로명주소 */}
                  <Input
                    name="roadAddress"
                    type="text"
                    value={formData.roadAddress}
                    placeholder="도로명주소"
                    className="bg-white text-black border border-black"
                    readOnly
                  />
                  
                  {/* 지번주소 */}
                  {formData.jibunAddress && (
                    <Input
                      name="jibunAddress"
                      type="text"
                      value={formData.jibunAddress}
                      placeholder="지번주소"
                      className="bg-white text-black border border-gray-300"
                      readOnly
                    />
                  )}
                  
                  {/* 상세주소 (선택사항) */}
                  <Input
                    id="detailAddress"
                    name="detailAddress"
                    type="text"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    placeholder="상세주소를 입력하세요 (선택사항)"
                    className={`bg-white text-black border ${errors.address ? 'border-red-500' : 'border-black'}`}
                  />
                  
                  {/* 전체 주소 미리보기 */}
                  {formData.roadAddress && (
                    <p className="text-xs text-gray-600">
                      전체 주소: {getFullAddress()}
                    </p>
                  )}
                  
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>

            <Button
  type="submit"
  size="lg"
  className="w-full bg-black text-white font-sans relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group overflow-hidden
  hover:bg-white hover:text-black border-2 border-transparent hover:border-black
  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
  disabled={isLoading}
>
  {isLoading ? '회원가입 중...' : '회원가입'}
</Button>

            </form>

            {/* 소셜 로그인 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-black">또는</span>
                </div>
              </div>
              
              <SocialLogin isSignup />
            </div>

            <div className="mt-6 text-center">
              <p className="text-black">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-black underline font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
