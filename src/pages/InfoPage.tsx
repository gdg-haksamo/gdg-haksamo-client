import MealInfo from '@/components/info/MealInfo'
import RestaurantInfo from '@/components/info/RestaurantInfo'
import NutritionInfo from '@/components/info/NutritionInfo'
import { MOCK_MEAL_INFO, MOCK_RESTAURANT_INFO, MOCK_NUTRITION_INFO } from '@/mocks/info'

export default function InfoPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <MealInfo {...MOCK_MEAL_INFO} />
      <RestaurantInfo {...MOCK_RESTAURANT_INFO} />
      <NutritionInfo {...MOCK_NUTRITION_INFO} />
    </div>
  )
}
