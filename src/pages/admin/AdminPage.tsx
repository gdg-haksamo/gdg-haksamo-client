import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Users, CalendarDays, RefreshCw, UtensilsCrossed } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMyPage } from '@/apis/me'
import UserManagement from '@/components/admin/UserManagement'
import EventManagement from '@/components/admin/EventManagement'
import CrawlSection from '@/components/admin/CrawlSection'
import MenuManagement from '@/components/admin/MenuManagement'
import type { UserRole } from '@/apis/types'

type SuperAdminTab = '계정 관리' | '이벤트/공지' | '크롤링'
type RestaurantAdminTab = '메뉴 관리'
type Tab = SuperAdminTab | RestaurantAdminTab

const SUPER_ADMIN_TABS: { label: SuperAdminTab; icon: React.ReactNode }[] = [
  { label: '계정 관리', icon: <Users size={18} /> },
  { label: '이벤트/공지', icon: <CalendarDays size={18} /> },
  { label: '크롤링', icon: <RefreshCw size={18} /> },
]

const RESTAURANT_ADMIN_TABS: { label: RestaurantAdminTab; icon: React.ReactNode }[] = [
  { label: '메뉴 관리', icon: <UtensilsCrossed size={18} /> },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const storedRole = useAuthStore((s) => s.role)
  const storedRestaurantId = useAuthStore((s) => s.managedRestaurantId)
  const setAuth = useAuthStore((s) => s.setAuth)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  // authStore에 role이 없으면 /api/me 재조회
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-page'],
    queryFn: getMyPage,
    enabled: isLoggedIn && !storedRole,
    retry: false,
  })

  useEffect(() => {
    if (profile?.role && !storedRole) {
      setAuth(profile.nickname, profile.role, profile.managedRestaurantId)
    }
  }, [profile, storedRole, setAuth])

  const role: UserRole | null = storedRole ?? profile?.role ?? null

  const [activeTab, setActiveTab] = useState<Tab>('계정 관리')

  if (!isLoggedIn) {
    navigate('/login', { replace: true })
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#f7f8fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e31e2d] border-t-transparent" />
      </div>
    )
  }

  if (role !== 'SUPER_ADMIN' && role !== 'RESTAURANT_ADMIN') {
    navigate('/', { replace: true })
    return null
  }

  const tabs = role === 'SUPER_ADMIN' ? SUPER_ADMIN_TABS : RESTAURANT_ADMIN_TABS
  const currentTab = tabs.find((t) => t.label === activeTab)?.label ?? tabs[0].label

  return (
    <div className="min-h-dvh bg-white md:bg-[#f7f8fa]">
      {/* ── PC 레이아웃: flex-row 사이드바 ── */}
      <div className="mx-auto flex h-dvh w-full flex-col md:h-auto md:min-h-dvh md:max-w-[1200px] md:flex-row md:gap-0">
        {/* ── 사이드바 (PC) / 헤더 (모바일) ── */}
        <aside className="flex shrink-0 flex-col md:w-60 md:min-h-dvh md:border-r md:border-[#f0f0f0] md:bg-white md:shadow-[2px_0_8px_0_rgba(0,0,0,0.04)]">
          {/* 공통 헤더 영역 */}
          <div className="flex h-[65px] items-center gap-3 border-b border-[#f0f0f0] px-5 md:h-[72px] md:px-6">
            <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <ChevronLeft size={24} className="text-black" />
            </button>
            <div className="flex flex-col">
              <p className="text-[17px] font-bold leading-none text-black">관리자</p>
              <span
                className={`mt-0.5 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  role === 'SUPER_ADMIN'
                    ? 'bg-[#fce8ea] text-[#e31e2d]'
                    : 'bg-[#fff3e0] text-[#e65100]'
                }`}
              >
                {role === 'SUPER_ADMIN' ? '슈퍼 관리자' : '식당 관리자'}
              </span>
            </div>
          </div>

          {/* 모바일: 수평 탭 / PC: 수직 사이드 메뉴 */}
          <nav className="flex border-b border-[#f0f0f0] md:mt-4 md:flex-col md:border-b-0 md:px-3 md:gap-1">
            {tabs.map(({ label, icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`
                  flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors
                  md:flex-none md:justify-start md:rounded-xl md:px-4 md:py-3
                  ${
                    currentTab === label
                      ? 'border-b-2 border-[#e31e2d] text-[#e31e2d] md:border-b-0 md:bg-[#fce8ea] md:text-[#e31e2d]'
                      : 'text-[#a0a0a0] md:hover:bg-[#f5f5f5] md:text-[#606060]'
                  }
                `}
              >
                <span className="hidden md:inline">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── 메인 콘텐츠 ── */}
        <main className="flex-1 overflow-y-auto md:bg-[#f7f8fa]">
          <div className="md:max-w-[800px]">
            {currentTab === '계정 관리' && <UserManagement />}
            {currentTab === '이벤트/공지' && <EventManagement />}
            {currentTab === '크롤링' && <CrawlSection />}
            {currentTab === '메뉴 관리' && (
              <MenuManagement managedRestaurantId={storedRestaurantId} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
