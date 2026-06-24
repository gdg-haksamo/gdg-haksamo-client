import { useQuery } from '@tanstack/react-query'
import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import type { MealMenuItemType } from '@/components/home/MealMenuItem'
import { getMenus } from '@/apis/menus'
import type { MenuResponse } from '@/apis/types'

function getCurrentMealType() {
  const hour = new Date().getHours()
  if (hour < 14) return '중식'
  if (hour < 19) return '저녁'
  return '아침'
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

const toMenuItem = (menu: MenuResponse): MealMenuItemType => ({
  name: menu.menuName,
  rating: menu.averageRating ?? 0,
  price: menu.price,
})

export default function HomePage() {
  const currentMeal = getCurrentMealType()
  const today = toDateString(new Date())

  const { data } = useQuery({
    queryKey: ['menus', today],
    queryFn: () => getMenus(today),
  })

  const breakfast = data?.breakfast.menus.map(toMenuItem) ?? []
  const lunch = data?.lunch.menus.map(toMenuItem) ?? []
  const dinner = data?.dinner.menus.map(toMenuItem) ?? []

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <RecommendedMenuCard />

      <CafeteriaTabMenu />

      <div className="flex flex-col gap-3">
        <MealCard mealType="아침" items={breakfast} defaultOpen={currentMeal === '아침'} />
        <MealCard mealType="중식" items={lunch} defaultOpen={currentMeal === '중식'} />
        <MealCard mealType="저녁" items={dinner} defaultOpen={currentMeal === '저녁'} />
      </div>
    </div>
  )
}
