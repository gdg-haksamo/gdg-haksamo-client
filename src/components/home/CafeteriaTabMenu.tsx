import { useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'

const CAFETERIA_TABS = ['공식당', '복지관', '정보센터', '카페테리아 첨성'] as const

type CafeteriaTab = (typeof CAFETERIA_TABS)[number]

type CafeteriaTabMenuProps = {
  onChange?: (tab: CafeteriaTab) => void
}

export default function CafeteriaTabMenu({ onChange }: CafeteriaTabMenuProps) {
  const [activeTab, setActiveTab] = useState<CafeteriaTab>('공식당')

  const handleTabClick = (tab: CafeteriaTab) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <ScrollContainer className="flex gap-2">
      {CAFETERIA_TABS.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => handleTabClick(tab)}
            className={`shrink-0 whitespace-nowrap rounded-[20px] px-4 py-2 text-[14px] font-semibold leading-none transition-colors duration-75 ${
              isActive ? 'bg-[#e31e2d] text-white' : 'bg-[#f0f0f0] text-[#606060]'
            }`}
          >
            {tab}
          </button>
        )
      })}
    </ScrollContainer>
  )
}
