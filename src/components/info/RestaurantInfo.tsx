import { Clock, MapPin } from 'lucide-react'
import type { RestaurantInfoData } from '@/mocks/info'

type RestaurantInfoProps = RestaurantInfoData

export default function RestaurantInfo({ location, time }: RestaurantInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[14px] font-bold text-black px-2">식당 정보</h2>

      <div className="flex flex-col gap-2 rounded-[12px] border border-[#E0E0E0] bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="shrink-0 text-[#E31E2D]" />
          <span className="text-[12px] font-regular text-black">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} className="shrink-0 text-[#E31E2D]" />
          <span className="text-[12px] font-regular text-black">{time}</span>
        </div>
      </div>
    </div>
  )
}
