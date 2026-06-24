import { useState } from 'react'
import { Camera, ChevronDown, Star, X } from 'lucide-react'

export type ReviewWriteFormData = {
  restaurant: string
  menuName: string
  menuId: number
  rating: number
  content: string
}

type ReviewWriteModalProps = {
  onClose: () => void
  onSubmit: (data: ReviewWriteFormData) => void
}

const SELECT_CLASS =
  'h-[40px] w-full appearance-none rounded-[12px] bg-[#F0F0F0] pl-3 pr-10 text-[12px] outline-none'

const MODAL_RESTAURANTS = ['정보센터', '복지관', '첨성'] as const

const MODAL_MENUS: Record<string, string[]> = {
  정보센터: ['제육볶음', '순두부찌개'],
  복지관: ['돈까스', '비빔밥'],
  첨성: ['김치찌개'],
}

const MENU_ID_MAP: Record<string, number> = {
  제육볶음: 110,
  순두부찌개: 111,
  돈까스: 112,
  비빔밥: 113,
  김치찌개: 114,
}

export default function ReviewWriteModal({ onClose, onSubmit }: ReviewWriteModalProps) {
  const [restaurant, setRestaurant] = useState('')
  const [menuName, setMenuName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')

  const menuOptions = restaurant ? (MODAL_MENUS[restaurant] ?? []) : []
  const isValid = restaurant !== '' && menuName !== '' && rating > 0

  const handleRestaurantChange = (value: string) => {
    setRestaurant(value)
    setMenuName('')
  }

  const handleSubmit = () => {
    if (!isValid) return

    onSubmit({
      restaurant,
      menuName,
      menuId: MENU_ID_MAP[menuName] ?? 0,
      rating,
      content: content.trim(),
    })
  }

  return (
    <div
      className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[600px] -translate-x-1/2 items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex w-full flex-col gap-5 overflow-y-auto rounded-t-[20px] bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-black">리뷰작성</span>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X size={20} className="text-[#A0A0A0]" />
          </button>
        </div>

        <div className="flex gap-5">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-[14px] font-semibold text-black">식당 선택</label>
            <div className="relative">
              <select
                value={restaurant}
                onChange={(e) => handleRestaurantChange(e.target.value)}
                className={`${SELECT_CLASS} ${restaurant ? 'text-black' : 'text-[#A0A0A0]'}`}
              >
                <option value="">식당을 선택하세요</option>
                {MODAL_RESTAURANTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#606060]"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-[14px] font-semibold text-black">메뉴 선택</label>
            <div className="relative">
              <select
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                disabled={!restaurant}
                className={`${SELECT_CLASS} ${menuName ? 'text-black' : 'text-[#A0A0A0]'}`}
              >
                <option value="">메뉴를 선택하세요</option>
                {menuOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
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

        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-black">별점</span>
          <div className="flex w-full items-center justify-between px-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                aria-label={`${index + 1}점`}
              >
                <Star
                  size={40}
                  className={index < rating ? 'fill-[#FFD900] text-[#FFD900]' : 'text-[#FFD900]'}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-semibold text-black">한줄평</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="솔직한 리뷰를 남겨주세요"
            className="h-[80px] resize-none rounded-[12px] bg-[#F0F0F0] px-5 py-4 text-[12px] text-black outline-none placeholder:text-[#A0A0A0]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-black">사진</span>
          <div className="flex h-[120px] flex-col items-center justify-center gap-2 rounded-[12px] bg-[#F0F0F0]">
            <Camera size={24} className="text-[#A0A0A0]" />
            <span className="text-[12px] text-[#A0A0A0]">사진 추가</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className="h-[48px] w-full rounded-[12px] bg-[#E31E2D] text-[14px] font-bold text-white disabled:opacity-40"
        >
          리뷰 등록
        </button>
      </div>
    </div>
  )
}
