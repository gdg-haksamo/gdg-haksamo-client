import { Home, Search, BookOpen, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const TAB_ITEMS = [
  { label: '홈', icon: Home, path: '/' },
  { label: '검색', icon: Search, path: '/search' },
  { label: '리뷰', icon: BookOpen, path: '/review' },
  { label: '마이', icon: User, path: '/my' },
]

export function Footer() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <footer className="flex h-[65px] w-full items-center justify-between bg-white px-5 shadow-[0px_-2px_4px_0px_rgba(205,205,205,0.25)]">
      {TAB_ITEMS.map(({ label, icon: Icon, path }) => {
        const isActive = pathname === path

        return (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="flex w-[76px] flex-col items-center gap-1"
            aria-label={label}
          >
            <Icon size={28} className={isActive ? 'text-black' : 'text-[#a0a0a0]'} />
            <span
              className={`text-[12px] font-semibold leading-none ${isActive ? 'text-black' : 'text-[#a0a0a0]'}`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </footer>
  )
}
