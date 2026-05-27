import { LogOut } from 'lucide-react'
import { ProfileCard } from '@/components/mypage/ProfileCard'
import { SelectRestaurant } from '@/components/mypage/SelectRestaurant'
import { SelectKeyword } from '@/components/mypage/SelectKeyword'
import { PushNotification } from '@/components/mypage/PushNotification'

export default function MyPage() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5">
      <ProfileCard />
      <SelectRestaurant />
      <SelectKeyword />
      <PushNotification />

      <button className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E0E0E0] bg-white py-4 text-[14px] font-bold text-[#A0A0A0]">
        <LogOut size={18} className="text-[#A0A0A0]" />
        로그아웃
      </button>
    </div>
  )
}
