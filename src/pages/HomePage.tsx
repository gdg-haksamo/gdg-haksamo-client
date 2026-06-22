import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import { MOCK_BREAKFAST_ITEMS, MOCK_LUNCH_ITEMS, MOCK_DINNER_ITEMS } from '@/mocks/home'

function getCurrentMealType() {
  const hour = new Date().getHours()
  if (hour < 14) return '중식'
  if (hour < 19) return '저녁'
  return '아침'
}

export default function HomePage() {
  const currentMeal = getCurrentMealType()

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <RecommendedMenuCard />

      <CafeteriaTabMenu />

      <div className="flex flex-col gap-3">
        <MealCard
          mealType="아침"
          items={MOCK_BREAKFAST_ITEMS}
          defaultOpen={currentMeal === '아침'}
        />
        <MealCard mealType="중식" items={MOCK_LUNCH_ITEMS} defaultOpen={currentMeal === '중식'} />
        <MealCard mealType="저녁" items={MOCK_DINNER_ITEMS} defaultOpen={currentMeal === '저녁'} />
      </div>
    </div>
  )
}
