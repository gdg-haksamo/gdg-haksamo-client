import { Droplet, Dumbbell, Flame, Wheat } from 'lucide-react'
import type { NutritionInfoData } from '@/mocks/info'

type NutritionInfoProps = NutritionInfoData

const NUTRITION_ITEMS = [
  {
    key: 'calories' as const,
    label: '칼로리',
    unit: 'kcal',
    icon: Flame,
    bg: 'bg-[#fce8ea]',
    iconColor: 'text-[#e31e2d]',
    valueColor: 'text-[#e31e2d]',
  },
  {
    key: 'carbs' as const,
    label: '탄수화물',
    unit: 'g',
    icon: Wheat,
    bg: 'bg-[#e8f0fc]',
    iconColor: 'text-[#3b82f6]',
    valueColor: 'text-[#3b82f6]',
  },
  {
    key: 'protein' as const,
    label: '단백질',
    unit: 'g',
    icon: Dumbbell,
    bg: 'bg-[#fff8e8]',
    iconColor: 'text-[#f59e0b]',
    valueColor: 'text-[#f59e0b]',
  },
  {
    key: 'fat' as const,
    label: '지방',
    unit: 'g',
    icon: Droplet,
    bg: 'bg-[#e8f5ea]',
    iconColor: 'text-[#22c55e]',
    valueColor: 'text-[#22c55e]',
  },
]

export default function NutritionInfo({ calories, carbs, protein, fat }: NutritionInfoProps) {
  const values = { calories, carbs, protein, fat }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[14px] font-bold text-black px-2">영양 정보</h2>

      <div className="grid grid-cols-4 gap-2">
        {NUTRITION_ITEMS.map(({ key, label, unit, icon: Icon, bg, iconColor, valueColor }) => (
          <div
            key={key}
            className={`flex flex-col items-center gap-2 rounded-[12px] px-2 py-3 ${bg}`}
          >
            <div className="flex size-9 items-center justify-center bg-white rounded-full">
              <Icon size={20} className={iconColor} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#A0A0A0]">{label}</span>
              <span className={`text-[14px] font-bold ${valueColor}`}>{values[key]}</span>
              <span className="text-[10px] text-[#A0A0A0]">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
