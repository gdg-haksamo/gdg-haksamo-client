import ReviewCard from '@/components/review/ReviewCard'
import { MOCK_REVIEWS } from '@/mocks/review'

export default function ReviewPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="h-20 flex items-center justify-center rounded-[12px] border border-[#F0F0F0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
        리뷰 이벤트 배너
      </div>
      {MOCK_REVIEWS.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
