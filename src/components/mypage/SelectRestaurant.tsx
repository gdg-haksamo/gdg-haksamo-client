import { useState } from 'react'
import { PencilLine } from 'lucide-react'

const ITEMS = ['공식당', '정보센터', '복지관', '카페테리아 첨성'] as const
type Restaurant = (typeof ITEMS)[number]

export function SelectRestaurant() {
  const [isEditing, setIsEditing] = useState(false)
  const [selected, setSelected] = useState<Record<Restaurant, boolean>>({
    공식당: true,
    정보센터: true,
    복지관: false,
    '카페테리아 첨성': false,
  })

  const toggleRestaurant = (label: Restaurant) => {
    if (!isEditing) return
    setSelected((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const visibleItems = isEditing ? ITEMS : ITEMS.filter((label) => selected[label])

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E0E0E0]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">자주 가는 식당</div>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="cursor-pointer flex items-center gap-1"
          >
            <PencilLine size={12} className="text-[#E31E2D]" />
            <div className="text-[12px] font-regular text-[#E31E2D]">
              {isEditing ? '저장' : '수정'}
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {visibleItems.map((label) => {
            const enabled = selected[label]

            const activeStyle =
              isEditing && enabled ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'

            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleRestaurant(label)}
                className={`flex items-center justify-center rounded-[20px] px-4 py-2 text-[12px] font-semibold ${activeStyle} ${
                  isEditing ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
