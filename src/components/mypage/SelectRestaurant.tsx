import { useState } from 'react'
import { PencilLine } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRestaurants } from '@/apis/modules/restaurants'
import { getMyPage, updateFavoriteRestaurants } from '@/apis/modules/me'

export function SelectRestaurant() {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<number | null>(null)

  const { data: restaurants } = useQuery({ queryKey: ['restaurants'], queryFn: getRestaurants })
  const { data: myData, isPending: isMyDataPending } = useQuery({
    queryKey: ['me'],
    queryFn: getMyPage,
  })

  const serverId = myData?.favoriteRestaurant?.restaurantId ?? null
  const selectedId = isEditing ? draft : serverId

  const startEdit = () => {
    setDraft(serverId)
    setIsEditing(true)
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => updateFavoriteRestaurants(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setIsEditing(false)
    },
  })

  const toggle = (id: number) => {
    setDraft((prev) => (prev === id ? null : id))
  }

  const visibleRestaurants = isEditing
    ? (restaurants ?? [])
    : (restaurants ?? []).filter((r) => r.restaurantId === selectedId)

  return (
    <div className="bg-white rounded-[12px] p-5 border border-[#E0E0E0]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-bold">자주 가는 식당</div>
          <button
            type="button"
            onClick={() => {
              if (isEditing) save()
              else startEdit()
            }}
            disabled={isPending || isMyDataPending}
            className="cursor-pointer flex items-center gap-1 disabled:opacity-50"
          >
            <PencilLine size={12} className="text-[#E31E2D]" />
            <div className="text-[12px] font-regular text-[#E31E2D]">
              {isEditing ? '저장' : '수정'}
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {visibleRestaurants.map((r) => {
            const isSelected = r.restaurantId === selectedId
            const activeStyle =
              isEditing && isSelected ? 'bg-[#E31E2D] text-white' : 'bg-[#F0F0F0] text-[#606060]'

            return (
              <button
                key={r.restaurantId}
                type="button"
                onClick={() => isEditing && toggle(r.restaurantId)}
                className={`flex items-center justify-center rounded-[20px] px-4 py-2 text-[12px] font-semibold ${activeStyle} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {r.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
