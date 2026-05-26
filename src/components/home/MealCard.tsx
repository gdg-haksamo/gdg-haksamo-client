import { useState } from 'react'
import { ChevronDown, ChevronUp, Utensils } from 'lucide-react'
import MealMenuItem, { type MealMenuItemType } from './MealMenuItem'

type MealType = '아침' | '중식' | '저녁'

type MealCardProps = {
  mealType: MealType
  items: MealMenuItemType[]
  defaultOpen?: boolean
}

export default function MealCard({ mealType, items, defaultOpen = false }: MealCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const isActive = isOpen

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#f0f0f0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[80px] w-full items-center justify-between border-b border-[#e0e0e0] bg-white px-5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 items-center justify-center rounded-full ${isActive ? 'bg-[#e31e2d]' : 'bg-[#f0f0f0]'}`}
          >
            <Utensils size={20} className={isActive ? 'text-white' : 'text-[#a0a0a0]'} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[16px] font-bold leading-none text-black">오늘의 {mealType}</span>
            <span className="text-[12px] leading-none text-[#a0a0a0]">{items.length}개 메뉴</span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-black" />
        ) : (
          <ChevronDown size={20} className="text-[#a0a0a0]" />
        )}
      </button>

      {isOpen && (
        <div>
          {items.map((item, index) => (
            <MealMenuItem key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
