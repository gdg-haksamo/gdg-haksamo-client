import { Sparkles } from 'lucide-react'
import type { MealInfoData } from '@/mocks/info'
import StarRating from './StarRating'
import hobanWoo from '@/assets/hoban-woo.svg'

type MealInfoProps = MealInfoData

export default function MealInfo({
  image,
  name,
  price,
  rating,
  reviewCount,
  aiDescription,
  soldOut = false,
}: MealInfoProps) {
  return (
    <div className="flex flex-col gap-5">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-[200px] w-full rounded-[12px] bg-[#F0F0F0] object-cover"
        />
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center rounded-[12px] bg-[#fce8ea]">
          <img src={hobanWoo} alt="" className="h-28 w-auto opacity-80" draggable={false} />
        </div>
      )}

      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex items-center gap-2">
            <div className={`text-[24px] font-bold text-black ${soldOut ? 'opacity-50' : ''}`}>
              {name}
            </div>
            {soldOut && (
              <span className="rounded-full bg-[#f0f0f0] px-2.5 py-1 text-[12px] font-bold text-[#a0a0a0]">
                품절
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <StarRating rating={rating} size={16} />
            <span className="text-[14px] font-bold text-black">{rating.toFixed(1)}</span>
            <span className="text-[14px] text-[#A0A0A0]">리뷰 {reviewCount}개</span>
          </div>
        </div>

        <span className="shrink-0 rounded-[50px] bg-[#E31E2D] px-6 py-3 text-[14px] font-bold text-white">
          {price.toLocaleString()} 원
        </span>
      </div>

      <div className="flex flex-col gap-1 rounded-[12px] bg-[#FCE8EA] px-5 py-4">
        <div className="flex items-center gap-1">
          <Sparkles size={14} className="text-[#E31E2D]" />
          <span className="text-[12px] font-semibold text-[#E31E2D]">AI 한줄 설명</span>
        </div>
        <p className="text-[14px] font-regular text-[#606060]">{aiDescription}</p>
      </div>
    </div>
  )
}
