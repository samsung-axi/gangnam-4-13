import { NavLink } from 'react-router-dom'
import {
  Message,
  CalendarToday,
  Person,
  // BarChart,
  // Restaurant,
  LocationOn as MapPin,
  CreditCard
} from '@mui/icons-material'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useNavigationStore } from '@/store/navigationStore'
import { toast } from 'react-hot-toast'

const navigationItems = [
  {
    title: '채팅',
    href: '/chat',
    icon: Message,
    description: 'AI와 대화하며 추천받기'
  },
  {
    title: '지도',
    href: '/map',
    icon: MapPin,
    description: '주변 키토 친화 식당'
  },
  {
    title: '캘린더',
    href: '/calendar',
    icon: CalendarToday,
    description: '식단 계획 관리'
  },
  {
    title: '프로필',
    href: '/profile',
    icon: Person,
    description: '개인 설정 및 목표'
  },
  {
    title: '구독',
    href: '/subscribe',
    icon: CreditCard,
    description: '구독 관리'
  }
]

const ketoTips = [
  { description: '탄수화물은 하루 20-30g 이하로 유지하고, 충분한 물을 섭취하세요!' },
  { description: '단백질은 과하지 않게, 균형 있게 드세요.' },
  { description: '지방은 아보카도, 올리브유, 코코넛 오일 등 좋은 지방 위주로 선택하세요' },
  { description: '아침은 건너뛰고 점심부터 시작해도 괜찮습니다. (간헐적 단식)' },
  { description: '치즈, 견과류, 올리브 같은 키토 간식을 준비해두세요.' },
  { description: '소스·드레싱·음료에 숨어 있는 탄수화물에 주의하세요.' },
  { description: '식이섬유를 충분히 먹어 장 건강을 지켜주세요. (브로콜리, 시금치 등)' },
  { description: '술은 탄수화물 적은 술만 조금 허용됩니다.' },
  { description: '체중보다 체지방률·사이즈 변화를 기준으로 기록하세요.' },
  { description: '배고픔보다 습관으로 먹고 있는지 스스로 확인하세요.' },
  { description: '운동 전 공복에 가벼운 걷기나 스트레칭을 해보세요.' },
  { description: '단백질 파우더를 사용할 때는 첨가물(당분) 확인이 필수입니다.' },
  { description: '외식 시 고기·해산물 위주 메뉴 + 채소 조합을 선택하세요.' },
  { description: '밥 대신 꽃양배추 라이스나 샐러드를 활용하세요.' },
  { description: '식사 시 탄수화물보다 지방·단백질을 먼저 드세요.' },
  { description: '밤 늦은 야식은 피하고, 일정한 시간에 식사하세요.' },
  { description: '기름은 튀김유 대신 올리브유·코코넛 오일을 활용하세요.' },
  { description: '영양제(오메가-3, 마그네슘, 비타민D) 보충을 고려하세요.' },
  { description: '탄산수, 허브티를 활용해 물 섭취를 다양화하세요.' },
  { description: '몸이 적응할 때 오는 키토 플루는 전해질 섭취로 완화됩니다.' },
  { description: '스트레스 관리와 숙면도 체중 감량에 큰 영향을 줍니다.' },
  { description: '배고플 땐 달걀 요리가 가장 간단한 키토 식사입니다.' },
  { description: '가짜 배고픔(갈증)을 구분하기 위해 물을 먼저 마셔보세요.' },
  { description: '과일은 딸기·블루베리 같은 베리류만 조금 허용됩니다.' },
  { description: '매일 같은 음식보다는 다양한 재료로 식단을 꾸리세요.' },
  { description: '외식 전 메뉴를 미리 확인해 키토 친화적인 선택을 준비하세요.' },
  { description: '목표는 단순히 살 빼기가 아니라 대사 건강 회복임을 기억하세요.' },
  { description: '완벽하게 지키지 못해도 괜찮습니다. 꾸준함이 성공의 핵심입니다.' },
]

// 랜덤하게 하나 선택하는 함수
const getRandomKetoTip = () => {
  const randomIndex = Math.floor(Math.random() * ketoTips.length)
  return ketoTips[randomIndex]
}


export function Navigation() {  
  const { user } = useAuthStore()
  const { isCollapsed } = useNavigationStore()
  const items = user ? navigationItems : navigationItems.filter((i) => i.href !== '/profile' && i.href !== '/calendar')
  const currentKetoTip = getRandomKetoTip()

  return (
    <nav className={cn(
      "bg-muted/30 border-r border-border min-h-screen transition-all duration-100",
      isCollapsed ? "w-16 p-2" : "w-64 p-4"
    )}>
      <div className={cn(
        "space-y-2",
        isCollapsed ? "flex flex-col items-center" : ""
      )}>
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={(e) => {
              if (!user && item.href === '/profile') {
                e.preventDefault()
                toast.error('로그인해야 이용할 수 있는 기능입니다')
              }
            }}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                isCollapsed ? "justify-center w-10 h-10" : "space-x-3 px-3 py-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )
            }
            title={isCollapsed ? item.title : undefined}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && (
              <div className="flex-1">
                <div>{item.title}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* 빠른 액션 */}
      {/* {!isCollapsed && (
        <div className="mt-8 pt-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            빠른 액션
          </h3>
          <div className="space-y-1">
            <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Restaurant sx={{ fontSize: 16 }} />
              <span>오늘 식단 추가</span>
            </button>
            <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <MapPin sx={{ fontSize: 16 }} />
              <span>주변 식당 찾기</span>
            </button>
            <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <BarChart sx={{ fontSize: 16 }} />
              <span>이번 주 통계</span>
            </button>
          </div>
        </div>
      )} */}

      {/* 키토 팁 */}
      {!isCollapsed && (
        <div className="mt-8 p-3 bg-keto-primary/10 rounded-lg">
          <h4 className="text-sm font-semibold text-keto-primary mb-1">
            오늘의 키토 팁 💡
          </h4>
          <p className="text-xs text-muted-foreground">
            {currentKetoTip.description}
          </p>
        </div>
      )}
    </nav>
  )
}