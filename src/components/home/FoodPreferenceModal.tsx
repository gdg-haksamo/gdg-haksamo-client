import { useState } from 'react'
import { X } from 'lucide-react'

const FOOD_KEYWORDS = [
  '매운음식',
  '고기',
  '해산물',
  '채식',
  '면류',
  '국물',
  '양식',
  '일식',
] as const

type FoodKeyword = (typeof FOOD_KEYWORDS)[number]

type FoodPreferenceModalProps = {
  initialKeywords?: FoodKeyword[]
  onClose: () => void
  onSave: (keywords: FoodKeyword[]) => void
}

export default function FoodPreferenceModal({
  initialKeywords = [],
  onClose,
  onSave,
}: FoodPreferenceModalProps) {
  const [selected, setSelected] = useState<FoodKeyword[]>(initialKeywords)

  const toggleKeyword = (keyword: FoodKeyword) => {
    setSelected((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword],
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[360px] rounded-[12px] border border-[#e0e0e0] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-bold text-black">선호 음식 키워드</span>
          <button type="button" onClick={onClose}>
            <X size={18} className="text-[#a0a0a0]" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {FOOD_KEYWORDS.map((keyword) => {
            const isActive = selected.includes(keyword)
            return (
              <button
                key={keyword}
                type="button"
                onClick={() => toggleKeyword(keyword)}
                className={`rounded-[20px] px-3 py-2 text-[12px] font-semibold transition-colors duration-75 ${
                  isActive ? 'bg-[#e31e2d] text-white' : 'bg-[#f0f0f0] text-[#606060]'
                }`}
              >
                {keyword}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onSave(selected)}
          className="mt-4 h-[44px] w-full rounded-[12px] bg-[#e31e2d] text-[14px] font-semibold text-white"
        >
          저장
        </button>
      </div>
    </div>
  )
}
