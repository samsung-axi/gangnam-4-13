import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AuthGuard from '../api/accessControl';
import { parseCookieKeyValue } from '../api/cookie';

interface AuthReturn {
  userId: number | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuth = (): AuthReturn => {
  const navigate = useNavigate();
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const [userId, setUserId] = useState<number>(-1);

  useEffect(() => {
    const cookieToken = cookie.token;
    // console.log('cookie: ', cookie);

    cookieToken == null && navigate("/");

    const _cookieContent = parseCookieKeyValue(cookieToken);
    // console.log('_cookieContent: ', _cookieContent);
    
    if (_cookieContent == null) {
      navigate("/");
    } else {
      const _cookieContentAccesToken = _cookieContent.access_token;
      const _cookieContentId = _cookieContent.id;

      if (_cookieContentAccesToken == null || _cookieContentId == null) {
        navigate("/");
      } else {
        const checkAuth = async () => {
          if (!_cookieContentId || !(await AuthGuard(_cookieContentId, _cookieContentAccesToken))) {
            navigate('/');
          } else {
            // console.log('_cookieContentId: ', _cookieContentId);
            setUserId(_cookieContentId);
          }
        };
        checkAuth();
      }
    }
  }, [cookie.token, navigate]);

  const logout = () => {
    removeCookie('token');
    navigate('/');
  };

  return {
    userId: userId || null,
    isAuthenticated: !!userId,
    logout
  };
}