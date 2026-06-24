import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReviewCard from '@/components/review/ReviewCard'
import ReviewFilters from '@/components/review/ReviewFilters'
import ReviewWriteFab from '@/components/review/ReviewWriteFab'
import ReviewWriteModal, { type ReviewWriteFormData } from '@/components/review/ReviewWriteModal'
import {
  restaurantToTab,
  tabToRestaurant,
  type RestaurantTab,
} from '@/components/review/reviewFilterUtils'
import { type ReviewSort } from '@/mocks/review'
import { type ReviewResponse, createReview, getMenuReviews } from '@/apis/review'
import { httpGet } from '@/apis/http'

function sortReviews(items: ReviewResponse[], sort: ReviewSort) {
  switch (sort) {
    case '최신순':
      return [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    case '인기순':
      return [...items].sort((a, b) => b.helpfulCount - a.helpfulCount)
    case '별점높은순':
      return [...items].sort((a, b) => b.rating - a.rating)
    case '별점낮은순':
      return [...items].sort((a, b) => a.rating - b.rating)
  }
}

export default function ReviewPage() {
  const [searchParams] = useSearchParams()
  const menuIdParam = searchParams.get('menuId')
  const initialMenuName = searchParams.get('menuName') ?? ''
  const initialRestaurant = searchParams.get('restaurant') ?? ''

  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<RestaurantTab>(() =>
    restaurantToTab(initialRestaurant),
  )
  const [query, setQuery] = useState(initialMenuName)
  const [sort, setSort] = useState<ReviewSort>('최신순')

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        if (menuIdParam) {
          const menuReviews = await getMenuReviews(Number(menuIdParam))
          setReviews(menuReviews)
        } else {
          const allReviews = await httpGet<ReviewResponse[]>('/api/reviews')
          setReviews(allReviews)
        }
      } catch (err) {
        console.error('리뷰 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReviews()
  }, [menuIdParam])

  const handleReviewSubmit = async (data: ReviewWriteFormData) => {
    try {
      const newReview = await createReview(data.menuId, {
        rating: data.rating,
        content: data.content.trim(),
      })
      setReviews((prev) => [newReview, ...prev])
      setIsWriteModalOpen(false)
    } catch (err) {
      console.error('리뷰 작성 실패:', err)
    }
  }

  const filtered = useMemo(() => {
    const restaurant = tabToRestaurant(activeTab)
    const q = query.trim()

    const byRestaurant = menuIdParam
      ? reviews
      : restaurant
        ? reviews.filter((r) => r.restaurant === restaurant)
        : reviews

    const byQuery =
      q.length === 0
        ? byRestaurant
        : byRestaurant.filter((r) => r.menuName.includes(q) || r.restaurant.includes(q))

    return sortReviews(byQuery, sort)
  }, [activeTab, query, sort, reviews, menuIdParam])

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
          <span className="text-[14px] font-semibold text-black">
            {isLoading ? '불러오는 중...' : `${filtered.length}개의 리뷰`}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((review) => (
            <ReviewCard key={review.reviewId} review={review} />
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
