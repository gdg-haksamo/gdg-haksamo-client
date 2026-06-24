import { useEffect, useRef, useState, useMemo } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import CafeteriaBottomSheet from '@/components/search/CafeteriaBottomSheet'
import type { MealMenuItemType } from '@/components/home/MealMenuItem'
import type { CafeteriaInfo } from '@/components/search/types'
import { getMenus } from '@/apis/menus'
import { getRestaurants, getRestaurantMenus } from '@/apis/restaurants'
import type { MenuResponse } from '@/apis/types'
import { MOCK_RECOMMENDED_MENUS } from '@/mocks/home'

const PULL_THRESHOLD = 70
const MAX_PULL = 90

const CAFETERIA_META: Record<string, string> = {
  공식당: '공대1호관 1층',
  복지관: '학생복지관 1층',
  정보센터: '종합정보센터 1층',
  '카페테리아 첨성': '첨성관 1층',
}

function getCurrentMealType() {
  const hour = new Date().getHours()
  if (hour < 14) return '중식'
  if (hour < 19) return '저녁'
  return '아침'
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

const toMenuItem = (menu: MenuResponse): MealMenuItemType => ({
  name: menu.menuName,
  rating: menu.averageRating ?? 0,
  price: menu.price,
})

export default function HomePage() {
  const currentMeal = getCurrentMealType()
  const today = toDateString(new Date())

  const { data } = useQuery({
    queryKey: ['menus', today],
    queryFn: () => getMenus(today),
  })

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  })

  const breakfast = data?.breakfast.menus.map(toMenuItem) ?? []
  const lunch = data?.lunch.menus.map(toMenuItem) ?? []
  const dinner = data?.dinner.menus.map(toMenuItem) ?? []

  const [menuIndex, setMenuIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 바텀시트용 선택된 식당
  const [selectedCafeteriaName, setSelectedCafeteriaName] = useState<string | null>(null)

  const matchName = (a: string, b: string) =>
    a.trim() === b.trim() || a.includes(b.trim()) || b.includes(a.trim())

  const selectedRestaurant = useMemo(
    () =>
      selectedCafeteriaName
        ? restaurants?.find((r) => matchName(r.name, selectedCafeteriaName))
        : undefined,
    [selectedCafeteriaName, restaurants],
  )

  const { data: selectedMenus } = useQuery({
    queryKey: ['restaurant-menus', selectedRestaurant?.restaurantId],
    queryFn: () => getRestaurantMenus(selectedRestaurant!.restaurantId),
    enabled: !!selectedRestaurant,
  })

  const selectedCafeteria = useMemo<CafeteriaInfo | null>(() => {
    if (!selectedCafeteriaName) return null
    return {
      id: String(selectedRestaurant?.restaurantId ?? selectedCafeteriaName),
      name: selectedCafeteriaName,
      building: CAFETERIA_META[selectedCafeteriaName] ?? '',
      position: { x: 0, y: 0 },
      menus: (selectedMenus ?? []).map((m) => ({
        menuId: m.menuId,
        name: m.name,
        price: m.price,
      })),
    }
  }, [selectedCafeteriaName, selectedRestaurant, selectedMenus])

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
        <RecommendedMenuCard menuIndex={menuIndex} isRefreshing={isRefreshing} />
        <CafeteriaTabMenu onChange={setSelectedCafeteriaName} />
        <div className="flex flex-col gap-3">
          <MealCard mealType="아침" items={breakfast} defaultOpen={currentMeal === '아침'} />
          <MealCard mealType="중식" items={lunch} defaultOpen={currentMeal === '중식'} />
          <MealCard mealType="저녁" items={dinner} defaultOpen={currentMeal === '저녁'} />
        </div>
      </div>

      <CafeteriaBottomSheet
        cafeteria={selectedCafeteria}
        onClose={() => setSelectedCafeteriaName(null)}
      />
    </div>
  )
}
