import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ChevronRight } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import CampusMap from '@/components/search/CampusMap'
import CafeteriaBottomSheet from '@/components/search/CafeteriaBottomSheet'
import type { CafeteriaInfo } from '@/components/search/types'
import { getMenus } from '@/apis/modules/menus'
import { getRestaurants, getRestaurantMenus } from '@/apis/modules/restaurants'
import type { MenuResponse, RestaurantMenuResponse } from '@/apis/types'
import cafeteriaMarker from '@/assets/cafeteria-marker.svg'

const BASE_CAFETERIAS = [
  { name: '공식당 교직원식당', building: '공대1호관 1층', position: { x: 45.5, y: 61.8 } },
  { name: '공식당 학생식당', building: '공대1호관 1층', position: { x: 47.2, y: 62.1 } },
  { name: '복지관', building: '학생복지관 1층', position: { x: 74.0, y: 53.0 } },
  { name: '정보센터', building: '종합정보센터 1층', position: { x: 70.1, y: 30.6 } },
  { name: '카페테리아 첨성', building: '첨성관 1층', position: { x: 76.9, y: 53.5 } },
  { name: '글로벌플라자', building: '글로벌플라자 1층', position: { x: 52.0, y: 35.0 } },
] as const

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

const matchRestaurant = (menuRestaurant: string, cafeteriaName: string) => {
  const a = menuRestaurant.trim()
  const b = cafeteriaName.trim()
  return a === b || a.includes(b) || b.includes(a)
}

function findMenuId(catalogMenus: RestaurantMenuResponse[], menuName: string): number | undefined {
  const exact = catalogMenus.find((m) => m.name === menuName)
  if (exact) return exact.menuId

  const partialMatches = catalogMenus
    .filter((m) => menuName.includes(m.name) || m.name.includes(menuName))
    .sort((a, b) => b.name.length - a.name.length)

  return partialMatches[0]?.menuId
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedCafeteria, setSelectedCafeteria] = useState<CafeteriaInfo | null>(null)
  const today = toDateString(new Date())

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  })

  const { data: menusData } = useQuery({
    queryKey: ['menus', today],
    queryFn: () => getMenus(today),
  })

  const menuQueries = useQueries({
    queries: (restaurants ?? []).map((r) => ({
      queryKey: ['restaurant-menus', r.restaurantId],
      queryFn: () => getRestaurantMenus(r.restaurantId),
    })),
  })

  const cafeterias = useMemo<CafeteriaInfo[]>(() => {
    const todayMenus: MenuResponse[] = [
      ...(menusData?.breakfast.menus ?? []),
      ...(menusData?.lunch.menus ?? []),
      ...(menusData?.dinner.menus ?? []),
    ]

    return BASE_CAFETERIAS.map((base) => {
      const restaurantIndex =
        restaurants?.findIndex((r) => matchRestaurant(r.name, base.name)) ?? -1
      const apiRestaurant = restaurantIndex >= 0 ? restaurants?.[restaurantIndex] : undefined
      const catalogMenus = restaurantIndex >= 0 ? (menuQueries[restaurantIndex]?.data ?? []) : []

      return {
        id: apiRestaurant != null ? String(apiRestaurant.restaurantId) : base.name,
        name: base.name,
        building: base.building,
        position: base.position,
        menus: todayMenus
          .filter((m) => matchRestaurant(m.restaurant, base.name))
          .map((m) => ({
            menuId: findMenuId(catalogMenus, m.menuName),
            name: m.menuName,
            price: m.price,
            rating: m.averageRating ?? undefined,
          })),
      }
    })
  }, [restaurants, menusData, menuQueries])

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
        <>
          <button
            type="button"
            aria-label="검색 닫기"
            className="absolute inset-0 z-[9] bg-black/30"
            onClick={() => setQuery('')}
          />
          <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-[20px] bg-white px-5 py-4 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)]">
            <p className="mb-3 text-[14px] font-bold text-black">
              검색 결과 <span className="text-[#e31e2d]">{matchedCafeterias.length}개 식당</span>
            </p>
            {matchedCafeterias.length === 0 ? (
              <p className="py-3 text-center text-[13px] text-[#a0a0a0]">검색 결과가 없습니다</p>
            ) : (
              <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
                {matchedCafeterias.map((cafe) => {
                  const q = query.toLowerCase()
                  const matchedMenu = cafe.menus.find((m) => m.name.toLowerCase().includes(q))
                  const displayMenu = matchedMenu ?? cafe.menus[0]

                  return (
                    <button
                      key={cafe.id}
                      type="button"
                      onClick={() => {
                        if (matchedMenu?.menuId) {
                          navigate(`/info/${matchedMenu.menuId}`)
                        } else {
                          setSelectedCafeteria(cafe)
                        }
                      }}
                      className="flex items-center gap-3 rounded-[10px] bg-[#f0f0f0] p-3 text-left"
                    >
                      <img src={cafeteriaMarker} alt="" className="size-7 shrink-0" />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[14px] font-bold text-black">{cafe.name}</span>
                          <span className="text-[11px] text-[#606060]">{cafe.building}</span>
                        </div>
                        {displayMenu && (
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#333]">
                              {displayMenu.name}
                            </span>
                            <span className="text-[13px] font-bold text-[#e31e2d]">
                              {displayMenu.price.toLocaleString()}원
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
        </>
      )}

      <CafeteriaBottomSheet
        cafeteria={selectedCafeteria}
        onClose={() => setSelectedCafeteria(null)}
      />
    </div>
  )
}
