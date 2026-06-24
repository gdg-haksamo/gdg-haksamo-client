import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import CafeteriaTabMenu from '@/components/home/CafeteriaTabMenu'
import MealCard from '@/components/home/MealCard'
import RecommendedMenuCard from '@/components/home/RecommendedMenuCard'
import type { MealMenuItemType } from '@/components/home/MealMenuItem'
import { getMenus } from '@/apis/menus'
import type { MenuResponse } from '@/apis/types'
import { MOCK_RECOMMENDED_MENUS } from '@/mocks/home'

const PULL_THRESHOLD = 70
const MAX_PULL = 90

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

  const breakfast = data?.breakfast.menus.map(toMenuItem) ?? []
  const lunch = data?.lunch.menus.map(toMenuItem) ?? []
  const dinner = data?.dinner.menus.map(toMenuItem) ?? []

  const [menuIndex, setMenuIndex] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
        <CafeteriaTabMenu />
        <div className="flex flex-col gap-3">
          <MealCard mealType="아침" items={breakfast} defaultOpen={currentMeal === '아침'} />
          <MealCard mealType="중식" items={lunch} defaultOpen={currentMeal === '중식'} />
          <MealCard mealType="저녁" items={dinner} defaultOpen={currentMeal === '저녁'} />
        </div>
      </div>
    </div>
  )
}
