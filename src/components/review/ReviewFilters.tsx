import { ChevronDown, Search } from 'lucide-react'
import type { ReviewSort } from '@/mocks/review'
import { RESTAURANT_TABS, type RestaurantTab } from '@/components/review/reviewFilterUtils'

type ReviewFiltersProps = {
  activeTab: RestaurantTab
  onTabChange: (tab: RestaurantTab) => void
  query: string
  onQueryChange: (value: string) => void
  sort: ReviewSort
  onSortChange: (value: ReviewSort) => void
}

const SORT_LABELS: ReviewSort[] = ['최신순', '인기순', '별점높은순', '별점낮은순']

export default function ReviewFilters({
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
}: ReviewFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {RESTAURANT_TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-[20px] px-3 py-2 text-[11px] font-semibold ${
                isActive ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-[12px] bg-[#F0F0F0] px-4 py-2">
          <Search size={16} className="text-[#A0A0A0]" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="메뉴 또는 식당 검색"
            className="w-full text-[12px] text-black outline-none placeholder:text-[#A0A0A0]"
          />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReviewSort)}
            className="h-[34px] appearance-none rounded-[12px] border border-[#F0F0F0] bg-white pl-3 pr-10 text-[12px] font-semibold text-[#606060] outline-none"
          >
            {SORT_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#606060]"
          />
        </div>
      </div>
    </div>
  )
}
