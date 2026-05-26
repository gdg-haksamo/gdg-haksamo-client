import { useState } from 'react'
import { ChevronDown, Utensils } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import MealMenuItem, { type MealMenuItemType } from './MealMenuItem'

type MealType = '아침' | '중식' | '저녁'

type MealCardProps = {
  mealType: MealType
  items: MealMenuItemType[]
  defaultOpen?: boolean
}

export default function MealCard({ mealType, items, defaultOpen = false }: MealCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="w-full overflow-hidden rounded-[12px] border border-[#f0f0f0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[80px] w-full items-center justify-between border-b border-[#e0e0e0] bg-white px-5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-[#e31e2d]' : 'bg-[#f0f0f0]'}`}
          >
            <Utensils size={20} className={isOpen ? 'text-white' : 'text-[#a0a0a0]'} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="text-[16px] font-bold leading-none text-black">오늘의 {mealType}</span>
            <span className="text-[12px] leading-none text-[#a0a0a0]">{items.length}개 메뉴</span>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className="text-[#a0a0a0]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {items.map((item, index) => (
              <MealMenuItem key={index} {...item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
