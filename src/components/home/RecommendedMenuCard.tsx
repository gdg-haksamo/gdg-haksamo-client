import { useState } from 'react'
import { RefreshCw, Pencil, Star, MapPin } from 'lucide-react'
import { MOCK_RECOMMENDED_MENUS } from '@/mocks/home'
import FoodPreferenceModal from './FoodPreferenceModal'

export default function RecommendedMenuCard() {
  const [menuIndex, setMenuIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const menu = MOCK_RECOMMENDED_MENUS[menuIndex]

  const handleRefresh = () => {
    const nextIndex = (menuIndex + 1) % MOCK_RECOMMENDED_MENUS.length
    setMenuIndex(nextIndex)
  }

  const handleEdit = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-[12px] border border-[#f0f0f0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div className="flex h-[200px] flex-col px-5 py-[19px]">
            <span className="text-[16px] font-semibold text-[#e31e2d]">{menu.label}</span>
            <span className="mt-3 text-[32px] font-bold leading-none text-black">{menu.name}</span>
            <span className="mt-[10px] text-[20px] font-bold leading-none text-black">
              {menu.price.toLocaleString()}원
            </span>
            <div className="mt-auto flex items-center gap-3">
              <div className="flex items-center">
                <Star size={24} className="shrink-0 fill-[#FFBB00] text-[#FFBB00]" />
                <span className="w-10 text-center text-[14px] font-medium tabular-nums text-black">
                  {menu.rating}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={24} className="text-[#a0a0a0]" />
                <span className="px-2.5 text-[14px] font-medium text-black">{menu.location}</span>
              </div>
            </div>
          </div>
          <img
            src={menu.image}
            alt={menu.name}
            className="absolute right-0 top-2 h-[181px] w-[144px] object-cover"
          />
        </div>

        <div className="flex items-center gap-3">
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
      </div>

      {isModalOpen && (
        <FoodPreferenceModal
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false)
          }}
        />
      )}
    </>
  )
}
