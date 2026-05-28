import MealInfo from '@/components/info/MealInfo'
import { MOCK_MEAL_INFO } from '@/mocks/info'

export default function InfoPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <MealInfo {...MOCK_MEAL_INFO} />
    </div>
  )
}
