import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SocialLogin from '@/components/auth/SocialLogin';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    loginId: '', // 이메일 또는 아이디
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.loginId.trim()) {
      newErrors.loginId = '아이디 또는 이메일을 입력해주세요';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await authService.login({
          loginId: formData.loginId,
          password: formData.password
        });
        if (response.success) {
          const { accessToken, refreshToken, user } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userId', user.id.toString());
          localStorage.setItem('userInfo', JSON.stringify(user));
          await authLogin(user, accessToken, refreshToken);
          toast.success(`${user.name}님, 환영합니다!`);
          navigate('/');
        } else {
          toast.error(response.message || '로그인에 실패했습니다.');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            '로그인에 실패했습니다.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <Card className="liquid-glass text-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black">로그인</CardTitle>
            <p className="text-gray-600">계정에 로그인하여 서비스를 이용하세요</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* 아이디 또는 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="loginId" className="text-black">아이디 또는 이메일</Label>
                  <Input
                    id="loginId"
                    name="loginId"
                    type="text"
                    value={formData.loginId}
                    onChange={handleInputChange}
                    placeholder="아이디 또는 이메일을 입력하세요"
                    className={`bg-white text-black border ${errors.loginId ? 'border-red-500' : 'border-black'}`}
                  />
                  {errors.loginId && (
                    <p className="text-sm text-red-500">
                      {errors.loginId}
                    </p>
                  )}
                </div>

                {/* Password */}
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
                      className={`bg-white text-black border pr-10 ${errors.password ? 'border-red-500' : 'border-black'}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
  type="submit"
  size="lg"
  className="w-full bg-black text-white font-sans relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group overflow-hidden
  hover:bg-white hover:text-black border-2 border-transparent hover:border-black
  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
  disabled={isLoading}
>
  {isLoading ? '로그인 중...' : '로그인'}
</Button>


            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-black">또는</span>
                </div>
              </div>
              
              <SocialLogin />
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                계정이 없으신가요?{' '}
                <Link to="/signup" className="text-black hover:underline font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
