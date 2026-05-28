import MealInfo from '@/components/info/MealInfo'
import RestaurantInfo from '@/components/info/RestaurantInfo'
import NutritionInfo from '@/components/info/NutritionInfo'
import CurrentReview from '@/components/info/CurrentReview'
import {
  MOCK_MEAL_INFO,
  MOCK_RESTAURANT_INFO,
  MOCK_NUTRITION_INFO,
  MOCK_REVIEWS,
} from '@/mocks/info'

export default function InfoPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <MealInfo {...MOCK_MEAL_INFO} />
      <RestaurantInfo {...MOCK_RESTAURANT_INFO} />
      <NutritionInfo {...MOCK_NUTRITION_INFO} />
      <CurrentReview reviews={MOCK_REVIEWS} />
    </div>
  )
}
