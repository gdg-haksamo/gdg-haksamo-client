import { User, Settings } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getMyPage } from '@/apis/modules/me'

export function ProfileCard() {
  const { data } = useQuery({ queryKey: ['me'], queryFn: getMyPage })

  return (
    <div className="bg-[#E31E2D] rounded-[12px] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-[72px] rounded-[20px] bg-white/50">
            <User size={32} className="text-white" />
          </div>

          <div className="flex flex-col">
            <p className="text-[12px] font-regular text-white">경북대학교 학생</p>
            <p className="text-[20px] font-bold text-white">{data?.nickname ?? '-'}</p>
            <p className="text-[12px] font-regular text-white">{data?.department ?? '-'}</p>
          </div>
        </div>

        <button className="cursor-pointer flex items-center justify-center size-[40px] rounded-full bg-white/50">
          <Settings size={20} className="text-white" />
        </button>
      </div>

      <div className="my-5 h-px bg-white/50"></div>

      <div className="flex items-center justify-between px-5">
        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">{data?.reviewCount ?? 0}</p>
          <p className="text-[12px] font-regular text-white">작성리뷰</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">{data?.helpfulReceivedCount ?? 0}</p>
          <p className="text-[12px] font-regular text-white">도움됐어요</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">{data?.activeEventCount ?? 0}</p>
          <p className="text-[12px] font-regular text-white">진행이벤트</p>
        </div>
      </div>
    </div>
  )
}
