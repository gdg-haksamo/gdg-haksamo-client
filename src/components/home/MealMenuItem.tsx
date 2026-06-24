import { Star } from 'lucide-react'

export type MealMenuItemType = {
  menuId?: number
  name: string
  rating?: number
  price: number
  isPopular?: boolean
  soldOut?: boolean
}

type MealMenuItemProps = MealMenuItemType

export default function MealMenuItem({
  name,
  rating,
  price,
  isPopular = false,
  soldOut = false,
}: MealMenuItemProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-[#f5f5f5] px-5 py-3.5 last:border-b-0 ${soldOut ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-black">{name}</span>
        {soldOut ? (
          <span className="rounded-full bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-bold text-[#a0a0a0]">
            품절
          </span>
        ) : (
          isPopular && (
            <span className="rounded-full bg-[#fce8ea] px-2 py-0.5 text-[10px] font-bold text-[#e31e2d]">
              인기
            </span>
          )
        )}
      </div>
      <div className="flex items-center gap-4">
        {rating != null && (
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-[#FFBB00] text-[#FFBB00]" />
            <span className="text-[12px] font-medium text-[#808080]">{rating.toFixed(1)}</span>
          </div>
        )}
        <span className="min-w-[52px] text-right text-[13px] font-semibold text-[#333]">
          {price.toLocaleString()}원
        </span>
      </div>
    </div>
  )
}
