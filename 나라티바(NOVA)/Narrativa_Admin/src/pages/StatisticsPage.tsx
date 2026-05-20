import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import PageLayout from "../components/ui/PageLayout";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import { RefreshCw } from 'lucide-react';
import { useToast } from "../hooks/useToast";
import { TrafficChart } from '../components/charts/TrafficChart';
import { GenreBarChart, GenrePieChart } from '../components/charts/GenreStats';
import { ActiveUserStats, BasicStats, GamePlaytime, GenrePlaytime } from '../types/stats';
import PlaytimeStats from '../components/charts/PlaytimeStats';
import { useAuth } from '../components/auth/AuthContext';
import ActiveUsersChart from '../components/charts/ActiveUsersChart';

const StatisticsPage: React.FC = () => {
 const [stats, setStats] = useState<BasicStats | null>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
 const [trafficView, setTrafficView] = useState<'daily' | 'weekly'>('daily');
 const { showToast } = useToast();
 const { admin } = useAuth();

 const BASE_URL = process.env.REACT_APP_BACKEND_URL;
 const auth = getAuth();

 const [targetGroupHealth, setTargetGroupHealth] = useState<Record<string, any[]>>({});
 const [gamePlaytimes, setGamePlaytimes] = useState<GamePlaytime[]>([]);
 const [genrePlaytimes, setGenrePlaytimes] = useState<GenrePlaytime[]>([]);
 const [activeUsers, setActiveUsers] = useState<ActiveUserStats | null>(null);
 
 // 인터벌 ID를 ref로 관리하여 새로고침 시 초기화할 수 있도록 함
 const intervalRef = useRef<NodeJS.Timeout | null>(null);
 const AUTO_REFRESH_INTERVAL = 300000; // 5분

 const fetchTargetGroupHealth = async () => {
   try {
     const idToken = await auth.currentUser?.getIdToken();
     const response = await axios.get(`${BASE_URL}/api/health/target-groups`, {
       headers: {
         Authorization: `Bearer ${idToken}`
       }
     });
     setTargetGroupHealth(response.data);
   } catch (error) {
     console.error('AWS 배포현황 조회 에러:', error);
     showToast("AWS 배포현황 조회에 실패했습니다", "error");
   }
 };

 const fetchStats = async () => {
   try {
     const idToken = await auth.currentUser?.getIdToken();
     const response = await axios.get(`${BASE_URL}/api/admin/stats/basic`, {
       headers: {
         Authorization: `Bearer ${idToken}`
       }
     });
     setStats(response.data);
   } catch (err) {
     console.error('통계 데이터 조회 에러:', err);
     showToast("통계 데이터 조회에 실패했습니다", "error");
   } finally {
     setLoading(false);
   }
 };

 const fetchPlaytimeStats = async () => {
   try {
     const idToken = await auth.currentUser?.getIdToken();
     const [gamesResponse, genreResponse] = await Promise.all([
       axios.get<GamePlaytime[]>(`${BASE_URL}/api/admin/games/playtime`, {
         headers: { Authorization: `Bearer ${idToken}` }
       }),
       axios.get<GenrePlaytime[]>(`${BASE_URL}/api/admin/games/playtime/genre`, {
         headers: { Authorization: `Bearer ${idToken}` }
       })
     ]);
     
     setGamePlaytimes(gamesResponse.data);
     setGenrePlaytimes(genreResponse.data);
   } catch (err) {
     console.error('플레이타임 데이터 조회 에러:', err);
     showToast("플레이타임 데이터 조회에 실패했습니다", "error");
   }
 };

 const fetchActiveUsers = async () => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    const response = await axios.get<ActiveUserStats>(
      `${BASE_URL}/api/admin/active-users`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    setActiveUsers(response.data);
  } catch (error) {
    console.error('활성 사용자 데이터 조회 에러:', error);
    showToast("활성 사용자 데이터 조회에 실패했습니다", "error");
  }
};

 const fetchData = async () => {
   setIsRefreshing(true);
   try {
     await Promise.all([
       fetchStats(),
       fetchTargetGroupHealth(),
       fetchPlaytimeStats(),
       fetchActiveUsers()
     ]);
   } catch (error) {
     console.error('데이터 조회 에러:', error);
     showToast("데이터 조회에 실패했습니다", "error");
   } finally {
     setIsRefreshing(false);
     setLoading(false);
   }
 };

 // 인터벌 설정 함수
 const setupInterval = () => {
   // 기존 인터벌이 있다면 제거
   if (intervalRef.current) {
     clearInterval(intervalRef.current);
   }
   
   // 새로운 인터벌 설정
   intervalRef.current = setInterval(() => {
     fetchData();
   }, AUTO_REFRESH_INTERVAL);
 };

 // 수동 새로고침 핸들러
 const handleRefresh = async () => {
   await fetchData();
   setupInterval();
   showToast("새로고침 완료", "success");
 };

 useEffect(() => {
  // admin과 currentUser 둘 다 체크
  if (!admin || !auth.currentUser) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return;
  }

  const initializeData = async () => {
    try {
      await fetchData();
      setupInterval();
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error);
    }
  };

  initializeData();

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
 }, [admin, auth.currentUser]);

 // 로딩 중이면 로딩 화면 표시
 if (loading) {
   return (
     <div className="h-full w-full flex justify-center items-center space-x-2">
       <LoadingAnimation />
     </div>
   );
 }

 return (
   <PageLayout 
     title="Statistics Dashboard"
     rightElement={stats?.timestamp && (
       <div className="flex items-center space-x-2">
         <span className="font-contents text-sm text-gray-500 hidden md:block">
           조회시간: {new Date(stats.timestamp).toLocaleString('ko-KR')}
         </span>
         <button 
           onClick={handleRefresh}
           disabled={isRefreshing}
           className="w-8 h-8 p-1 bg-white hover:bg-gray-100 rounded-full transition-all 
           hover:shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center"
           aria-label="새로고침"
         >
           <div className="relative">
             <RefreshCw className={`w-4 h-4 font-nanum text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
             {isRefreshing && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-pointer2 border-t-transparent rounded-full animate-spin" />
               </div>
             )}
           </div>
         </button>
       </div>
     )}
   >
     <div className="space-y-6 overflow-y-auto">
       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          {activeUsers && <ActiveUsersChart data={activeUsers} />}
        </div>
         <TrafficChart 
           view={trafficView}
           stats={stats}
           onViewChange={setTrafficView}
         />

         <div className="grid grid-cols-1 gap-6">
           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-lg font-title font-semibold text-gray-700">총 사용자 수</h2>
             <p className="text-3xl font-contents font-bold text-pointer">{stats?.totalUsers}</p>
           </div>

           <div className="bg-white rounded-lg shadow-md p-6 relative">
             <h2 className="text-lg font-title font-semibold text-gray-700 mb-4">평균 플레이타임</h2>
             <PlaytimeStats 
               gamePlaytimes={gamePlaytimes}   
               genrePlaytimes={genrePlaytimes} 
             />
           </div>
         </div>
       </div>

       {/* 두 번째 그리드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="">
            <GenreBarChart gamesByGenre={stats?.gamesByGenre || {}} />
          </div>
          <div className="">
            <GenrePieChart gamesByGenre={stats?.gamesByGenre || {}} />
          </div>
          {/* AWS 배포현황 섹션 */}
         <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
           <h2 className="text-lg font-title font-semibold text-gray-700">AWS 현황</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             {Object.entries(targetGroupHealth).map(([groupName, healthDescriptions]) => (
               <div key={groupName} className="p-4 bg-gray-50 rounded-lg">
                 {healthDescriptions.map((description, index) => (
                   <div key={index}>
                     <h3 className="text-md font-contents font-semibold text-gray-600">{description.targetId}</h3>
                     <div className="flex justify-between items-center mt-2">
                       <span className="text-sm font-contents text-gray-600">{groupName}</span>
                       <span className={`px-2 py-1 rounded-full font-contents text-xs font-medium ${
                         description.state === 'healthy' ? 'bg-green-100 text-green-800' :
                         description.state === 'unhealthy' ? 'bg-red-100 text-red-800' :
                         'bg-gray-100 font-contents text-gray-800'
                       }`}>
                         {description.state}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             ))}
           </div>
         </div>
        </div>
     </div>
   </PageLayout>
 );
};

export default StatisticsPage;