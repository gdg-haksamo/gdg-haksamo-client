import { Star } from 'lucide-react'

type StarRatingProps = {
  rating: number
  size?: number
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < fullStars ? 'fill-[#FFD900] text-[#FFD900]' : 'fill-[#E0E0E0] text-[#E0E0E0]'
          }
        />
      ))}
    </div>
  )
}
