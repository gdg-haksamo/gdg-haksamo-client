import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import type { MealMenuItemType } from '@/components/home/MealMenuItem'
import { getAccessToken } from '@/apis/http'
import { getMenus } from '@/apis/modules/menus'
import { getRestaurants, getRestaurantMenus } from '@/apis/modules/restaurants'
import type { MenuResponse, RestaurantMenuResponse } from '@/apis/types'
import { MOCK_RECOMMENDED_MENUS, type RecommendedMenuType } from '@/mocks/home'

const PULL_THRESHOLD = 70
const MAX_PULL = 90

function getCurrentMealType(): string | null {
  const hour = new Date().getHours()
  if (hour < 9) return '아침'
  if (hour < 14) return '중식'
  if (hour < 19) return '저녁'
  return null
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

const matchRestaurant = (menuRestaurant: string, tabName: string) => {
  const a = menuRestaurant.trim()
  const b = tabName.trim()
  return a === b || a.includes(b) || b.includes(a)
}

const matchMenuName = (menuName: string, searchName: string) => {
  const a = menuName.trim()
  const b = searchName.trim()
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

function resolveRecommendedMenuId(
  menu: RecommendedMenuType,
  todayMenus: MenuResponse[],
  allCatalogs: RestaurantMenuResponse[][],
): number | undefined {
  const todayMatch = todayMenus.find(
    (m) => matchRestaurant(m.restaurant, menu.location) && matchMenuName(m.menuName, menu.name),
  )
  const menuNameToLookup = todayMatch?.menuName ?? menu.name

  for (const catalog of allCatalogs) {
    const id = findMenuId(catalog, menuNameToLookup)
    if (id) return id
  }

  return undefined
}

function resolveMealMenuId(
  menuName: string,
  cafeteriaName: string,
  restaurants: { restaurantId: number; name: string }[] | undefined,
  menuQueries: { data?: RestaurantMenuResponse[] }[],
): number | undefined {
  const restaurantIndex =
    restaurants?.findIndex((r) => matchRestaurant(r.name, cafeteriaName)) ?? -1
  const catalog = restaurantIndex >= 0 ? (menuQueries[restaurantIndex]?.data ?? []) : []
  const id = findMenuId(catalog, menuName)
  if (id) return id

  for (const query of menuQueries) {
    const fallbackId = findMenuId(query.data ?? [], menuName)
    if (fallbackId) return fallbackId
  }

  return undefined
}

export default function HomePage() {
  const currentMeal = getCurrentMealType()
  const today = toDateString(new Date())
  const hasToken = !!getAccessToken()

  const { data } = useQuery({
    queryKey: ['menus', today],
    queryFn: () => getMenus(today),
  })

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
    enabled: hasToken,
  })

  const menuQueries = useQueries({
    queries: (restaurants ?? []).map((r) => ({
      queryKey: ['restaurant-menus', r.restaurantId],
      queryFn: () => getRestaurantMenus(r.restaurantId),
      enabled: hasToken,
    })),
  })

  const [menuIndex, setMenuIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedCafeteriaName, setSelectedCafeteriaName] = useState<string>('공식당 학생식당')

  const filterMenus = (menus: MenuResponse[]) =>
    menus.filter((m) => matchRestaurant(m.restaurant, selectedCafeteriaName))

  const mapToMenuItems = (menus: MenuResponse[]): MealMenuItemType[] =>
    menus.map((menu) => ({
      name: menu.menuName,
      rating: menu.averageRating ?? 0,
      price: menu.price,
      soldOut: menu.soldOut,
      menuId: resolveMealMenuId(menu.menuName, selectedCafeteriaName, restaurants, menuQueries),
    }))

  const breakfast = mapToMenuItems(filterMenus(data?.breakfast.menus ?? []))
  const lunch = mapToMenuItems(filterMenus(data?.lunch.menus ?? []))
  const dinner = mapToMenuItems(filterMenus(data?.dinner.menus ?? []))

  const todayMenus = useMemo<MenuResponse[]>(
    () => [
      ...(data?.breakfast.menus ?? []),
      ...(data?.lunch.menus ?? []),
      ...(data?.dinner.menus ?? []),
    ],
    [data],
  )

  const allCatalogs = useMemo(
    () => menuQueries.map((q) => q.data ?? []).filter((catalog) => catalog.length > 0),
    [menuQueries],
  )

  const recommendedMenu = MOCK_RECOMMENDED_MENUS[menuIndex]
  const recommendedMenuId = recommendedMenu
    ? resolveRecommendedMenuId(recommendedMenu, todayMenus, allCatalogs)
    : undefined

  const containerRef = useRef<HTMLDivElement>(null)
  const isRefreshingRef = useRef(false)

  const pullHeight = useMotionValue(0)
  const indicatorOpacity = useTransform(pullHeight, [0, PULL_THRESHOLD], [0, 1])
  const iconRotation = useTransform(pullHeight, [0, PULL_THRESHOLD], [0, 180])

  useEffect(() => {
    isRefreshingRef.current = isRefreshing
  }, [isRefreshing])

  useEffect(() => {
    const main = containerRef.current?.parentElement
    if (!main) return

    let startY = 0
    let pulling = false

    const triggerOrCancel = () => {
      const h = pullHeight.get()
      animate(pullHeight, 0, { type: 'spring', stiffness: 300, damping: 28 })
      if (h >= PULL_THRESHOLD) setIsRefreshing(true)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (main.scrollTop > 0 || isRefreshingRef.current) return
      startY = e.touches[0].clientY
      pulling = true
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!pulling) return
      const diff = e.touches[0].clientY - startY
      if (diff <= 0) {
        pulling = false
        return
      }
      e.preventDefault()
      pullHeight.set(Math.min(diff * 0.5, MAX_PULL))
    }
    const onTouchEnd = () => {
      if (!pulling) return
      pulling = false
      triggerOrCancel()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (main.scrollTop > 0 || isRefreshingRef.current || e.button !== 0) return
      e.preventDefault()
      startY = e.clientY
      pulling = true
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!pulling) return
      const diff = e.clientY - startY
      if (diff <= 0) {
        pulling = false
        pullHeight.set(0)
        return
      }
      pullHeight.set(Math.min(diff * 0.5, MAX_PULL))
    }
    const onMouseUp = () => {
      if (!pulling) return
      pulling = false
      triggerOrCancel()
    }

    main.addEventListener('touchstart', onTouchStart, { passive: true })
    main.addEventListener('touchmove', onTouchMove, { passive: false })
    main.addEventListener('touchend', onTouchEnd)
    main.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      main.removeEventListener('touchstart', onTouchStart)
      main.removeEventListener('touchmove', onTouchMove)
      main.removeEventListener('touchend', onTouchEnd)
      main.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [pullHeight])

  useEffect(() => {
    const t1 = setTimeout(() => {
      animate(pullHeight, 55, { duration: 0.45, ease: [0.2, 0, 0.8, 1] })
    }, 600)
    const t2 = setTimeout(() => {
      animate(pullHeight, 0, { type: 'spring', stiffness: 280, damping: 24 })
    }, 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pullHeight])

  useEffect(() => {
    if (!isRefreshing) return
    const timer = setTimeout(() => {
      setMenuIndex((prev) => (prev + 1) % MOCK_RECOMMENDED_MENUS.length)
      setIsRefreshing(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [isRefreshing])

  return (
    <div ref={containerRef} className="flex flex-col px-5 py-4">
      <motion.div
        style={{ height: pullHeight }}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ opacity: indicatorOpacity, rotate: iconRotation }}>
          <RefreshCw size={22} className="text-[#e31e2d]" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col gap-4">
        <RecommendedMenuCard
          menuIndex={menuIndex}
          isRefreshing={isRefreshing}
          menuId={recommendedMenuId}
        />
        <CafeteriaTabMenu onChange={setSelectedCafeteriaName} />
        <div className="flex flex-col gap-3">
          <MealCard mealType="아침" items={breakfast} defaultOpen={currentMeal === '아침'} />
          <MealCard mealType="중식" items={lunch} defaultOpen={currentMeal === '중식'} />
          <MealCard mealType="저녁" items={dinner} defaultOpen={currentMeal === '저녁'} />
        </div>
      </div>
    </div>
  )
}
