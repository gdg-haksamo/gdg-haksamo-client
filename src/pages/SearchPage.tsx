import { useState, useMemo } from 'react'
import { Search, X, ChevronRight } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import CampusMap from '@/components/search/CampusMap'
import CafeteriaBottomSheet from '@/components/search/CafeteriaBottomSheet'
import type { CafeteriaInfo } from '@/components/search/types'
import { getRestaurants, getRestaurantMenus } from '@/apis/restaurants'
import cafeteriaMarker from '@/assets/cafeteria-marker.svg'

const BASE_CAFETERIAS = [
  { name: '공식당', building: '공대1호관 1층', position: { x: 45.6, y: 62.1 } },
  { name: '복지관', building: '학생복지관 1층', position: { x: 74.0, y: 53.0 } },
  { name: '정보센터', building: '종합정보센터 1층', position: { x: 70.1, y: 30.6 } },
  { name: '카페테리아 첨성', building: '첨성관 1층', position: { x: 76.9, y: 53.5 } },
] as const

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedCafeteria, setSelectedCafeteria] = useState<CafeteriaInfo | null>(null)

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  })

  const menuQueries = useQueries({
    queries: (restaurants ?? []).map((r) => ({
      queryKey: ['restaurant-menus', r.restaurantId],
      queryFn: () => getRestaurantMenus(r.restaurantId),
    })),
  })

  const cafeterias = useMemo<CafeteriaInfo[]>(() => {
    return BASE_CAFETERIAS.map((base) => {
      const apiRestaurant = restaurants?.find((r) => r.name === base.name)
      const queryIndex = restaurants?.findIndex((r) => r.name === base.name) ?? -1
      const menusData = queryIndex >= 0 ? menuQueries[queryIndex]?.data : undefined

      return {
        id: apiRestaurant != null ? String(apiRestaurant.restaurantId) : base.name,
        name: base.name,
        building: base.building,
        position: base.position,
        menus: (menusData ?? []).map((m) => ({
          menuId: m.menuId,
          name: m.name,
          price: m.price,
        })),
      }
    })
  }, [restaurants, menuQueries])

  const matchedCafeterias = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return cafeterias.filter(
      (cafe) =>
        cafe.name.toLowerCase().includes(q) ||
        cafe.menus.some((menu) => menu.name.toLowerCase().includes(q)),
    )
  }, [query, cafeterias])

  const highlightedIds = matchedCafeterias.map((c) => c.id)

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <CampusMap
        cafeterias={cafeterias}
        highlightedIds={highlightedIds}
        onMarkerClick={setSelectedCafeteria}
      />

      <div className="absolute left-0 right-0 top-0 z-10 px-5 py-3">
        <div className="flex h-10 items-center gap-2 rounded-[10px] bg-white px-4 shadow-sm">
          <Search size={18} className="shrink-0 text-[#a0a0a0]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="음식명이나 학식당을 검색해보세요"
            className="flex-1 bg-transparent text-[14px] font-semibold text-black outline-none placeholder:font-normal placeholder:text-[#a0a0a0]"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}>
              <X size={18} className="text-[#a0a0a0]" />
            </button>
          )}
        </div>
      </div>

      {query.trim() && (
        <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-[20px] bg-white px-5 py-4 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)]">
          <p className="mb-3 text-[14px] font-bold text-black">
            검색 결과 <span className="text-[#e31e2d]">{matchedCafeterias.length}개 식당</span>
          </p>
          {matchedCafeterias.length === 0 ? (
            <p className="py-3 text-center text-[13px] text-[#a0a0a0]">검색 결과가 없습니다</p>
          ) : (
            <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
              {matchedCafeterias.map((cafe) => {
                const matchedMenu =
                  cafe.menus.find((m) => m.name.toLowerCase().includes(query.toLowerCase())) ??
                  cafe.menus[0]

                return (
                  <button
                    key={cafe.id}
                    type="button"
                    onClick={() => setSelectedCafeteria(cafe)}
                    className="flex items-center gap-3 rounded-[10px] bg-[#f0f0f0] p-3 text-left"
                  >
                    <img src={cafeteriaMarker} alt="" className="size-7 shrink-0" />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[14px] font-bold text-black">{cafe.name}</span>
                        <span className="text-[11px] text-[#606060]">{cafe.building}</span>
                      </div>
                      {matchedMenu && (
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-[#333]">
                            {matchedMenu.name}
                          </span>
                          <span className="text-[13px] font-bold text-[#e31e2d]">
                            {matchedMenu.price.toLocaleString()}원
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[#c0c0c0]" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <CafeteriaBottomSheet
        cafeteria={selectedCafeteria}
        onClose={() => setSelectedCafeteria(null)}
      />
    </div>
  )
}
