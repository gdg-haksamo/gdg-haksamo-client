import { Star } from 'lucide-react'

export type MealMenuItemType = {
  name: string
  rating: number
  price: number
  isPopular?: boolean
}

type MealMenuItemProps = MealMenuItemType

export default function MealMenuItem({
  name,
  rating,
  price,
  isPopular = false,
}: MealMenuItemProps) {
  return (
    <div className="flex h-[40px] items-center justify-between border border-[#f0f0f0] px-5">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-black">{name}</span>
        {isPopular && (
          <span className="rounded-[20px] bg-[#fce8ea] px-2 py-1 text-[10px] font-semibold text-[#e31e2d]">
            인기
          </span>
        )}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <Star size={16} className="fill-[#FFBB00] text-[#FFBB00]" />
          <span className="text-[12px] font-semibold text-black">{rating.toFixed(1)}</span>
        </div>
        <span className="text-[12px] font-semibold text-black">{price.toLocaleString()}원</span>
      </div>
    </div>
  )
}
