import { User, Settings } from 'lucide-react'

export function ProfileCard() {
  return (
    <div className="bg-[#E31E2D] rounded-[12px] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-[72px] rounded-[20px] bg-white/50">
            <User size={32} className="text-white" />
          </div>

          <div className="flex flex-col">
            <p className="text-[12px] font-regular text-white">경북대학교 학생</p>
            <p className="text-[20px] font-bold text-white">호반우</p>
            <p className="text-[12px] font-regular text-white">컴퓨터학부 / 2학년</p>
          </div>
        </div>

        <button className="cursor-pointer flex items-center justify-center size-[40px] rounded-full bg-white/50">
          <Settings size={20} className="text-white" />
        </button>
      </div>

      <div className="my-5 h-px bg-white/50"></div>

      <div className="flex items-center justify-between px-5">
        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">5</p>
          <p className="text-[12px] font-regular text-white">작성리뷰</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">5</p>
          <p className="text-[12px] font-regular text-white">작성리뷰</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[24px] font-bold text-white">5</p>
          <p className="text-[12px] font-regular text-white">작성리뷰</p>
        </div>
      </div>
    </div>
  )
}
