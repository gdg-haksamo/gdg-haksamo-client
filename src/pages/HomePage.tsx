import { RefreshCw, Pencil, Star, MapPin } from 'lucide-react'
import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import {
  MOCK_RECOMMENDED_MENU,
  MOCK_BREAKFAST_ITEMS,
  MOCK_LUNCH_ITEMS,
  MOCK_DINNER_ITEMS,
} from '@/mocks/home'

export default function HomePage() {
  const handleRefresh = () => {}

  const handleEdit = () => {}

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="relative overflow-hidden rounded-[12px] border border-[#f0f0f0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <div className="flex h-[200px] flex-col justify-between p-5">
          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-semibold text-[#e31e2d]">
              {MOCK_RECOMMENDED_MENU.label}
            </span>
            <span className="text-[32px] font-bold leading-none text-black">
              {MOCK_RECOMMENDED_MENU.name}
            </span>
            <span className="text-[20px] font-bold leading-none text-black">
              {MOCK_RECOMMENDED_MENU.price.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Star size={24} className="fill-[#FFBB00] text-[#FFBB00]" />
              <span className="px-2 text-[14px] font-medium text-black">
                {MOCK_RECOMMENDED_MENU.rating}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin size={24} className="text-[#a0a0a0]" />
              <span className="px-2 text-[14px] font-medium text-black">
                {MOCK_RECOMMENDED_MENU.location}
              </span>
            </div>
          </div>
        </div>
        <img
          src={MOCK_RECOMMENDED_MENU.image}
          alt={MOCK_RECOMMENDED_MENU.name}
          className="absolute right-2 top-2 h-[181px] w-[144px] object-cover"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleRefresh}
          className="flex h-[40px] flex-1 items-center justify-center gap-2 rounded-[12px] bg-[#f0f0f0]"
        >
          <RefreshCw size={20} className="text-black" />
          <span className="text-[14px] font-medium text-black">추천 메뉴 새로고침</span>
        </button>
        <button
          type="button"
          onClick={handleEdit}
          className="flex h-[40px] w-[80px] items-center justify-center rounded-[12px] bg-[#f0f0f0]"
        >
          <Pencil size={24} className="text-black" />
        </button>
      </div>

      <CafeteriaTabMenu />

      <div className="flex flex-col gap-3">
        <MealCard mealType="아침" items={MOCK_BREAKFAST_ITEMS} />
        <MealCard mealType="중식" items={MOCK_LUNCH_ITEMS} defaultOpen />
        <MealCard mealType="저녁" items={MOCK_DINNER_ITEMS} />
      </div>
    </div>
  )
}
