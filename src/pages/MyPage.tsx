import { LogOut, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { logout } from '@/apis/modules/auth'
import { setAccessToken } from '@/apis/http'
import { useAuthStore } from '@/store/authStore'
import { ProfileCard } from '@/components/mypage/ProfileCard'
import { SelectRestaurant } from '@/components/mypage/SelectRestaurant'
import { SelectKeyword } from '@/components/mypage/SelectKeyword'
import { PushNotification } from '@/components/mypage/PushNotification'

export default function MyPage() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const role = useAuthStore((s) => s.role)

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      setAccessToken(null)
      clearAuth()
      navigate('/login')
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-5 p-5">
      <ProfileCard />
      <SelectRestaurant />
      <SelectKeyword />
      <PushNotification />

      {(role === 'SUPER_ADMIN' || role === 'RESTAURANT_ADMIN') && (
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e31e2d] bg-white py-4 text-[14px] font-bold text-[#e31e2d]"
        >
          <ShieldCheck size={18} />
          관리자 페이지
        </button>
      )}

      <button
        type="button"
        onClick={() => handleLogout()}
        disabled={isPending}
        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-[#E0E0E0] bg-white py-4 text-[14px] font-bold text-[#A0A0A0] disabled:opacity-50"
      >
        <LogOut size={18} className="text-[#A0A0A0]" />
        로그아웃
      </button>
    </div>
  )
}
