import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewCard from '@/components/review/ReviewCard'
import ReviewFilters from '@/components/review/ReviewFilters'
import ReviewWriteFab from '@/components/review/ReviewWriteFab'
import ReviewWriteModal, { type ReviewWriteFormData } from '@/components/review/ReviewWriteModal'
import { tabToRestaurant, type RestaurantTab } from '@/components/review/reviewFilterUtils'
import { type ReviewSort } from '@/mocks/review'
import { ApiError } from '@/apis/error'
import { setAccessToken } from '@/apis/http'
import { getMenuReviews, createReview, type ReviewResponse } from '@/apis/review'
import { useAuthStore } from '@/store/authStore'

function isAuthError(err: unknown) {
  if (!(err instanceof ApiError)) return false
  const authCodes = ['AUTH_EXPIRED', 'A005']
  return err.status === 401 || authCodes.includes(err.code) || err.message.includes('로그인')
}

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

// 리뷰 페이지에서 보여줄 menuId 목록 (임시 - 나중에 전체 메뉴 API로 교체)
const MENU_IDS = [110, 111, 112, 113, 114]

export default function ReviewPage() {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<RestaurantTab>('전체')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ReviewSort>('최신순')

  // 여러 메뉴의 리뷰를 한꺼번에 불러오기
  useEffect(() => {
    if (!isLoggedIn) return

    const fetchAllReviews = async () => {
      setIsLoading(true)
      try {
        const results = await Promise.all(MENU_IDS.map((id) => getMenuReviews(id)))
        const allReviews = results.flat()
        setReviews(allReviews)
      } catch (err) {
        if (isAuthError(err)) {
          setAccessToken(null)
          clearAuth()
          return
        }
        console.error('리뷰 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllReviews()
  }, [isLoggedIn, clearAuth])

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

    const byRestaurant = restaurant ? reviews.filter((r) => r.restaurant === restaurant) : reviews

    const byQuery =
      q.length === 0
        ? byRestaurant
        : byRestaurant.filter((r) => r.menuName.includes(q) || r.restaurant.includes(q))

    return sortReviews(byQuery, sort)
  }, [activeTab, query, sort, reviews])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5">
        <p className="text-center text-[16px] font-semibold text-black">
          리뷰를 보려면 로그인이 필요해요
        </p>
        <p className="text-center text-[14px] text-[#606060]">
          로그인 후 리뷰를 확인하고 작성할 수 있어요
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-2 rounded-[12px] bg-[#E31E2D] px-8 py-3 text-[14px] font-bold text-white"
        >
          로그인하기
        </button>
      </div>
    )
  }

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
