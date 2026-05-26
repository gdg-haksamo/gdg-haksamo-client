import { ChevronLeft, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  title?: string
  showBack?: boolean
}

export function Header({ title = '학사모', showBack = true }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex h-[65px] w-full items-center justify-between bg-white px-5 py-2 shadow-[0px_2px_4px_0px_rgba(205,205,205,0.25)]">
      <div className="size-7">
        {showBack && (
          <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ChevronLeft size={28} className="text-black" />
          </button>
        )}
      </div>

      <p className="text-[20px] font-extrabold leading-none text-black">{title}</p>

      <div className="size-7 flex items-center justify-center">
        <Gift size={28} className="text-red-500" />
      </div>
    </header>
  )
}
