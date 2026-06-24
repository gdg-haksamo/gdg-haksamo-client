import { useNavigate } from 'react-router-dom'
import { ChevronRight, User } from 'lucide-react'
import type { ReviewItem } from '@/mocks/info'
import StarRating from './StarRating'

type CurrentReviewProps = {
  reviews: ReviewItem[]
  menuId: number
  menuName: string
  restaurant: string
}

export default function CurrentReview({
  reviews,
  menuId,
  menuName,
  restaurant,
}: CurrentReviewProps) {
  const navigate = useNavigate()

  const handleViewAll = () => {
    const params = new URLSearchParams({
      menuId: String(menuId),
      menuName,
      restaurant,
    })
    navigate(`/review?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-black px-2">최근 리뷰</h2>

        <button
          type="button"
          onClick={handleViewAll}
          className="cursor-pointer flex items-center gap-1 text-[12px] text-[#A0A0A0]"
        >
          전체 보기
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {reviews.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-[#a0a0a0]">리뷰가 없습니다</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-3 rounded-[12px] border border-[#F5F5F5] bg-white px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[12px] font-Sbold text-[#A0A0A0]">
                    <User size={16} className="text-[#A0A0A0]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-black">{review.authorName}</p>
                    <p className="text-[10px] text-[#A0A0A0]">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={12} />
              </div>
              <div className="text-[12px] text-black">{review.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
