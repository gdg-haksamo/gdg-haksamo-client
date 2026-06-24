import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Lock, User } from 'lucide-react'
import mascot from '@/assets/mascot.png'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/apis/auth'
import { getMyPage } from '@/apis/me'
import { setAccessToken } from '@/apis/http'
import { useAuthStore } from '@/store/authStore'
import { Footer } from '@/components/layouts/Footer'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const setAuth = useAuthStore((s) => s.setAuth)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { accessToken } = await login({ email, password })
      setAccessToken(accessToken)
      return getMyPage()
    },
    onSuccess: ({ nickname, role, managedRestaurantId }) => {
      setAuth(nickname, role, managedRestaurantId)
      navigate(role === 'SUPER_ADMIN' || role === 'RESTAURANT_ADMIN' ? '/admin' : '/')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  return (
    <div className="min-h-dvh bg-white md:bg-[#eceef3]">
      <div className="mx-auto flex h-dvh w-full max-w-[600px] flex-col overflow-hidden bg-white md:shadow-[0_0_20px_rgba(29,32,56,0.14)]">
        <header className="flex h-[65px] w-full shrink-0 items-center justify-between px-5 shadow-[0px_2px_4px_0px_rgba(205,205,205,0.25)]">
          <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ChevronLeft size={28} className="text-black" />
          </button>
          <p className="text-[20px] font-extrabold leading-none text-black">로그인</p>
          <div className="size-7" />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 pb-10">
          <img src={mascot} alt="마스코트" className="h-[140px] w-auto" />

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            <div className="flex items-center gap-3 rounded-[12px] bg-[#F0F0F0] px-4 py-4">
              <User size={20} className="shrink-0 text-[#A0A0A0]" />
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[14px] text-black outline-none placeholder:text-[#A0A0A0]"
              />
            </div>

            <div className="flex items-center gap-3 rounded-[12px] bg-[#F0F0F0] px-4 py-4">
              <Lock size={20} className="shrink-0 text-[#A0A0A0]" />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[14px] text-black outline-none placeholder:text-[#A0A0A0]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !email || !password}
              className="mt-1 w-full rounded-[12px] bg-[#E31E2D] py-4 text-[16px] font-bold text-white disabled:opacity-50"
            >
              로그인
            </button>
          </form>

          <p className="text-[14px] text-[#606060]">
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className="font-bold text-[#E31E2D]">
              회원가입
            </Link>
          </p>
        </main>

        <Footer />
      </div>
    </div>
  )
}
