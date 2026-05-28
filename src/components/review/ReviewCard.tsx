import { Heart, User } from 'lucide-react'
import type { ReviewItem } from '@/mocks/review'
import StarRating from '../info/StarRating'

type ReviewCardProps = {
  review: ReviewItem
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[#F5F5F5] bg-white px-5 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0]">
            <User size={16} className="text-[#A0A0A0]" />
          </div>

          <div className="flex flex-col">
            <p className="text-[14px] font-bold text-black">{review.authorName}</p>
            <p className="text-[10px] text-[#A0A0A0]">{review.date}</p>
          </div>
        </div>

        <StarRating rating={review.rating} size={12} />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[12px] font-semibold text-[#E31E2D] bg-[#FCE8EA] px-3 py-1 rounded-[50px]">
          {review.menuName}
        </span>
        <span className="text-[12px] font-semibold text-[#808080] bg-[#F0F0F0] px-3 py-1 rounded-[50px]">
          {review.restaurant}
        </span>
      </div>

      <p className="text-[12px] font-regular text-black">{review.content}</p>

      <div className="flex items-center justify-end gap-2 text-[#606060]">
        <Heart size={16} className="text-[#E31E2D]" />
        <span className="text-[12px] font-semibold">{review.likeCount}</span>
      </div>
    </div>
  )
}
