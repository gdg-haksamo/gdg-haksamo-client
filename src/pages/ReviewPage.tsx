import { useMemo, useState } from 'react'
import ReviewCard from '@/components/review/ReviewCard'
import ReviewFilters from '@/components/review/ReviewFilters'
import ReviewWriteFab from '@/components/review/ReviewWriteFab'
import ReviewWriteModal, { type ReviewWriteFormData } from '@/components/review/ReviewWriteModal'
import { tabToRestaurant, type RestaurantTab } from '@/components/review/reviewFilterUtils'
import { MOCK_REVIEWS, type ReviewItem, type ReviewSort } from '@/mocks/review'

function formatReviewDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function parseReviewDate(date: string) {
  const match = date.match(/(\d+)년 (\d+)월 (\d+)일/)
  if (!match) return 0

  const [, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function sortReviews(items: ReviewItem[], sort: ReviewSort) {
  switch (sort) {
    case '최신순':
      return [...items].sort((a, b) => parseReviewDate(b.date) - parseReviewDate(a.date))
    case '인기순':
      return [...items].sort((a, b) => b.likeCount - a.likeCount)
    case '별점높은순':
      return [...items].sort((a, b) => b.rating - a.rating)
    case '별점낮은순':
      return [...items].sort((a, b) => a.rating - b.rating)
  }
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<RestaurantTab>('전체')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ReviewSort>('최신순')

  const handleReviewSubmit = (data: ReviewWriteFormData) => {
    const newReview: ReviewItem = {
      id: `r${Date.now()}`,
      restaurant: data.restaurant,
      menuName: data.menuName,
      authorName: '김민준',
      date: formatReviewDate(new Date()),
      rating: data.rating,
      likeCount: 0,
      content: data.content.trim(),
    }

    setReviews((prev) => [newReview, ...prev])
    setIsWriteModalOpen(false)
  }

  const filtered = useMemo(() => {
    const restaurant = tabToRestaurant(activeTab)
    const q = query.trim()

    const byRestaurant = restaurant ? reviews.filter((r) => r.restaurant === restaurant) : reviews

    const byQuery =
      q.length === 0
        ? byRestaurant
        : byRestaurant.filter((r) => r.menuName.includes(q) || r.restaurant.includes(q))

    return sortReviews(byQuery, sort)
  }, [activeTab, query, sort, reviews])

  return (
    <>
      <div className="flex flex-col gap-5 p-5 pb-24">
        <div className="h-15 flex items-center justify-center rounded-[12px] border border-[#F0F0F0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          리뷰 이벤트 배너
        </div>

        <ReviewFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-black">{filtered.length}개의 리뷰</span>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      <ReviewWriteFab onClick={() => setIsWriteModalOpen(true)} />

      {isWriteModalOpen && (
        <ReviewWriteModal
          onClose={() => setIsWriteModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  )
}
