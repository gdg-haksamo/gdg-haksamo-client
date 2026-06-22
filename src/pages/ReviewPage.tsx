import { useMemo, useState } from 'react'
import ReviewCard from '@/components/review/ReviewCard'
import ReviewFilters from '@/components/review/ReviewFilters'
import { tabToRestaurant, type RestaurantTab } from '@/components/review/reviewFilterUtils'
import { MOCK_REVIEWS, type ReviewItem, type ReviewSort } from '@/mocks/review'

function sortReviews(items: ReviewItem[], sort: ReviewSort) {
  switch (sort) {
    case '최신순':
      return [...items].reverse()
    case '인기순':
      return [...items].sort((a, b) => b.likeCount - a.likeCount)
    case '별점높은순':
      return [...items].sort((a, b) => b.rating - a.rating)
    case '별점낮은순':
      return [...items].sort((a, b) => a.rating - b.rating)
  }
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<RestaurantTab>('전체')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ReviewSort>('최신순')

  const filtered = useMemo(() => {
    const restaurant = tabToRestaurant(activeTab)
    const q = query.trim()

    const byRestaurant = restaurant
      ? MOCK_REVIEWS.filter((r) => r.restaurant === restaurant)
      : MOCK_REVIEWS

    const byQuery =
      q.length === 0
        ? byRestaurant
        : byRestaurant.filter((r) => r.menuName.includes(q) || r.restaurant.includes(q))

    return sortReviews(byQuery, sort)
  }, [activeTab, query, sort])

  return (
    <div className="flex flex-col gap-5 p-5">
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
  )
}
