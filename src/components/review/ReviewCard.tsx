import { useState } from 'react'
import { Heart, User } from 'lucide-react'
import type { ReviewResponse } from '@/apis/review'
import { toggleHelpful } from '@/apis/review'
import StarRating from '../info/StarRating'

type ReviewCardProps = {
  review: ReviewResponse
}

function formatReviewDate(isoDate: string) {
  const date = new Date(isoDate)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)

  const handleLikeClick = async () => {
    try {
      await toggleHelpful(review.reviewId)
      setIsLiked((prev) => !prev)
      setHelpfulCount((count) => count + (isLiked ? -1 : 1))
    } catch (err) {
      console.error('도움됐어요 실패:', err)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[#F5F5F5] bg-white px-5 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F0F0F0]">
            <User size={16} className="text-[#A0A0A0]" />
          </div>
          <div className="flex flex-col">
            <p className="text-[14px] font-bold text-black">user {review.userId}</p>
            <p className="text-[10px] text-[#A0A0A0]">{formatReviewDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={12} />
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-[50px] bg-[#FCE8EA] px-3 py-1 text-[12px] font-semibold text-[#E31E2D]">
          {review.menuName}
        </span>
        <span className="rounded-[50px] bg-[#F0F0F0] px-3 py-1 text-[12px] font-semibold text-[#808080]">
          {review.restaurant}
        </span>
      </div>

      {review.content && <p className="text-[12px] text-black">{review.content}</p>}

      <button
        type="button"
        onClick={handleLikeClick}
        className="flex items-center justify-end gap-2 self-end text-[#606060]"
      >
        <Heart size={16} className={isLiked ? 'fill-[#E31E2D] text-[#E31E2D]' : 'text-[#E31E2D]'} />
        <span className="text-[12px] font-semibold">{helpfulCount}</span>
      </button>
    </div>
  )
}
