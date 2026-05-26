import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import { MOCK_BREAKFAST_ITEMS, MOCK_LUNCH_ITEMS, MOCK_DINNER_ITEMS } from '@/mocks/home'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <RecommendedMenuCard />

      <CafeteriaTabMenu />

      <div className="flex flex-col gap-3">
        <MealCard mealType="아침" items={MOCK_BREAKFAST_ITEMS} />
        <MealCard mealType="중식" items={MOCK_LUNCH_ITEMS} defaultOpen />
        <MealCard mealType="저녁" items={MOCK_DINNER_ITEMS} />
      </div>
    </div>
  )
}
