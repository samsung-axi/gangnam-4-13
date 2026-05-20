import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../configs/firebaseConfig';
import { RootState } from '../../store';
import { setLogoutStartTime } from '../../store/authSlice';
import { AdminUser, AdminRole, AdminStatus } from '../../types/admin';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error("REACT_APP_BACKEND_URL is not defined in environment variables");
}

// 로그인 결과 타입 정의
interface LoginResult {
  status: 'WAITING' | 'APPROVED';
}

interface AuthContextProps {
  admin: AdminUser | null;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  login: () => Promise<LoginResult>;
  logout: () => Promise<void>;
  updateUserRole: (userId: number, newRole: AdminRole) => void;
  isLoading: boolean;
  resetLogoutTimer: () => void;
  logoutStartTime: number | null;
  getIdToken: () => Promise<string>;
  checkAdminStatus: () => Promise<AdminUser | undefined>;
}

// 기본값 설정
const AuthContext = createContext<AuthContextProps>({
  admin: null,
  userRole: 'WAITING',
  setUserRole: () => {},
  login: async () => ({ status: 'WAITING' }),
  logout: async () => {},
  updateUserRole: () => {},
  isLoading: false,
  resetLogoutTimer: () => {},
  logoutStartTime: null,
  getIdToken: async () => '',
  checkAdminStatus: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { logoutStartTime } = useSelector((state: RootState) => state.auth);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [userRole, setUserRole] = useState<AdminRole>("WAITING");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 스토리지에서 로그아웃 타이머 복원
    const storedLogoutStartTime = sessionStorage.getItem("logoutStartTime");
    if (storedLogoutStartTime) {
      const elapsedTime = Date.now() - Number(storedLogoutStartTime);
      const remainingTime = 1800000 - elapsedTime; // 30분 - 경과 시간
      if (remainingTime > 0) {
        dispatch(setLogoutStartTime(Number(storedLogoutStartTime)));
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, remainingTime);
      } else {
        logout();
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: token })
          });

          if (response.ok) {
            const adminData = await response.json();
            setAdmin({
              uid: adminData.uid,
              email: adminData.email,
              username: adminData.username,
              role: adminData.role as AdminRole,
              status: adminData.status as AdminStatus,
            });
            setUserRole(adminData.role);
            
            if (!sessionStorage.getItem("logoutStartTime")) {
              startLogoutTimer();
            }
          } else {
            setAdmin(null);
            setUserRole("WAITING");
          }
        } else {
          setAdmin(null);
          setUserRole("WAITING");
        }
      } catch (error) {
        setAdmin(null);
        setUserRole("WAITING");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const startLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    const currentTime = Date.now();
    dispatch(setLogoutStartTime(currentTime));
    sessionStorage.setItem("logoutStartTime", currentTime.toString());

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, 1800000);
  };

  const resetLogoutTimer = () => {
    startLogoutTimer();
  };

  const getIdToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user");
    }
    return user.getIdToken();
  };

  const login = async (): Promise<LoginResult> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken })
        });

        if (response.status === 500) {
          try {
            const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken })
            });

            if (registerResponse.status === 201 || registerResponse.status === 400) {
              const waitingUser = {
                uid: result.user.uid,
                email: result.user.email || '',
                username: result.user.displayName || '',
                role: 'WAITING' as AdminRole,
                status: 'ACTIVE' as AdminStatus
              };
              setAdmin(waitingUser);
              setUserRole('WAITING');
              navigate('/approval-pending');
              return { status: 'WAITING' };
            }
          } catch (error) {
            throw error;
          }
        }

        if (response.ok) {
          const data = await response.json();
          setAdmin(data);
          setUserRole(data.role);
          resetLogoutTimer();
          navigate('/');
          return { status: 'APPROVED' };
        }

        throw new Error('Verification failed');

      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      await auth.signOut();
      setAdmin(null);
      setUserRole("WAITING");
      sessionStorage.removeItem("logoutStartTime");
      window.location.href = '/login';
    } catch (error) {
      throw error;
    }
  };

  const updateUserRole = async (userId: number, newRole: AdminRole) => {
    try {
      const user = auth.currentUser;
      if (!user || !admin) throw new Error("No authenticated user");

      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Role update failed: ${errorText}`);
      }

      if (admin.uid === userId.toString()) {
        setUserRole(newRole);
      }
    } catch (error) {
      throw error;
    }
  };

  const checkAdminStatus = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("인증 토큰이 없습니다.");

      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken })
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        setUserRole(data.role);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        userRole: admin?.role || "WAITING",
        setUserRole,
        login,
        logout,
        updateUserRole,
        isLoading,
        resetLogoutTimer,
        logoutStartTime,
        getIdToken,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};