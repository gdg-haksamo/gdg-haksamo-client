import { Sparkles } from 'lucide-react'
import hobanWoo from '@/assets/hoban-woo.svg'

export default function ReviewEventBanner() {
  return (
    <div className="relative overflow-hidden rounded-[12px] bg-gradient-to-br from-[#E31E2D] via-[#f03545] to-[#ff6b5a] px-5 py-4 shadow-[0px_4px_12px_0px_rgba(227,30,45,0.35)]">
      <div className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 left-1/3 size-16 rounded-full bg-white/10" />

      <div className="relative flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
            <Sparkles size={10} />
            GRAND OPEN
          </span>
          <p className="text-[18px] font-extrabold leading-tight text-white drop-shadow-sm">
            학사모 오픈했어요~
          </p>
          <p className="text-[12px] font-medium leading-snug text-white/90">
            경북대 학식 정보, 리뷰, 검색까지 한곳에서!
            <br />
            지금 리뷰 남기고 함께 채워가요 ✨
          </p>
        </div>

        <img
          src={hobanWoo}
          alt=""
          className="h-[72px] w-auto shrink-0 drop-shadow-md"
          draggable={false}
        />
      </div>
    </div>
  )
}
