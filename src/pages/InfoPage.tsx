import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import MealInfo from '@/components/info/MealInfo'
import RestaurantInfo from '@/components/info/RestaurantInfo'
import NutritionInfo from '@/components/info/NutritionInfo'
import CurrentReview from '@/components/info/CurrentReview'
import type { ReviewItem } from '@/mocks/info'
import { getMenuDetail } from '@/apis/modules/menus'
import type { PopularReviewResponse } from '@/apis/types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

const toReviewItem = (r: PopularReviewResponse, i: number): ReviewItem => ({
  id: `${r.userId}-${i}`,
  authorName: r.authorNickname,
  date: formatDate(r.createdAt),
  rating: r.rating,
  content: r.content ?? '',
})

export default function InfoPage() {
  const { menuId } = useParams<{ menuId: string }>()
  const { data } = useQuery({
    queryKey: ['menu', menuId],
    queryFn: () => getMenuDetail(Number(menuId)),
    enabled: !!menuId,
  })

  if (!data) return null

  return (
    <div className="flex flex-col gap-5 p-5">
      <MealInfo
        image={data.imageUrl ?? undefined}
        name={data.menuName}
        price={data.price}
        rating={data.averageRating ?? 0}
        reviewCount={data.reviewCount}
        aiDescription={data.description ?? ''}
        soldOut={data.soldOut}
      />
      <RestaurantInfo location={data.restaurant} time={data.operatingTime ?? ''} />
      <NutritionInfo
        calories={data.nutrition.calories ?? 0}
        carbs={data.nutrition.carb ?? 0}
        protein={data.nutrition.protein ?? 0}
        fat={data.nutrition.fat ?? 0}
      />
      <CurrentReview
        reviews={data.popularReviews.map(toReviewItem)}
        menuId={Number(menuId)}
        menuName={data.menuName}
        restaurant={data.restaurant}
      />
    </div>
  )
}
