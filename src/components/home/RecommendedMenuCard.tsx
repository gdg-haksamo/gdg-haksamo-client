import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate, AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { MapPin, Pencil } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import FoodPreferenceModal from './FoodPreferenceModal'
import hobanWoo from '@/assets/hoban-woo.svg'
import { getTodayRecommendation, refreshRecommendation } from '@/apis/modules/recommendations'
import { getAccessToken } from '@/apis/http'
import type { TodayRecommendationResponse } from '@/apis/types'

const ITEM_HEIGHT = 44
const LOOPS = 5

type Props = {
  refreshRef: { current: (() => void) | null }
}

type PendingInfo = {
  reel: string[]
  targetIdx: number
}

function SlotMachine({ items, targetIdx }: { items: string[]; targetIdx: number }) {
  const reel = Array(LOOPS + 1)
    .fill(items)
    .flat()
  const finalPos = LOOPS * items.length + targetIdx
  const targetY = -Math.round(finalPos * ITEM_HEIGHT)
  const y = useMotionValue(0)

  useEffect(() => {
    const controls = animate(y, targetY, {
      duration: 2.6,
      ease: [0.05, 0.7, 0.25, 1],
    })
    return () => controls.stop()
  }, [y, targetY])

  return (
    <div className="w-48 overflow-hidden rounded-xl bg-white/20" style={{ height: ITEM_HEIGHT }}>
      <motion.div style={{ y }}>
        {reel.map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-center overflow-hidden px-2"
            style={{ height: ITEM_HEIGHT }}
          >
            <span className="w-full truncate text-center text-[16px] font-bold text-white drop-shadow-sm">
              {name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function RecommendedMenuCard({ refreshRef }: Props) {
  const navigate = useNavigate()
  const hasToken = !!getAccessToken()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recs, setRecs] = useState<TodayRecommendationResponse[]>([])
  const recsRef = useRef<TodayRecommendationResponse[]>([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [pendingInfo, setPendingInfo] = useState<PendingInfo | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: initialRec } = useQuery({
    queryKey: ['recommendation-today'],
    queryFn: () => getTodayRecommendation(),
    enabled: hasToken,
  })

  useEffect(() => {
    if (initialRec && recsRef.current.length === 0) {
      recsRef.current = [initialRec]
      setRecs([initialRec])
    }
  }, [initialRec])

  const startOverlayTimer = (targetIdx: number, reel: string[]) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPendingInfo({ reel, targetIdx: targetIdx % reel.length })
    timerRef.current = setTimeout(() => {
      setShowOverlay(false)
      setPendingInfo(null)
    }, 2800)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: refreshRecommendation,
    onMutate: () => {
      setShowOverlay(true)
      setPendingInfo(null)
    },
    onSuccess: (data) => {
      const next = [...recsRef.current, data]
      recsRef.current = next
      setRecs(next)
      startOverlayTimer(
        next.length - 1,
        next.map((r) => r.menuName),
      )
    },
    onError: () => {
      setShowOverlay(false)
    },
  })

  useEffect(() => {
    refreshRef.current = () => {
      if (isPending) return
      const latest = recsRef.current[recsRef.current.length - 1]
      if (latest && latest.refreshCount >= latest.totalCount) return
      mutate(undefined)
    }
  }, [mutate, isPending, refreshRef])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const recommendation = recs[recs.length - 1] ?? initialRec

  if (!recommendation) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
        <span className="text-[14px] text-[#606060]">추천 메뉴가 없습니다.</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)]">
          <AnimatePresence>
            {showOverlay && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #3ecfcf 0%, #2db8d4 100%)' }}
              >
                <img src={hobanWoo} alt="호반우" className="h-14 w-auto drop-shadow-lg" />
                <p className="text-[15px] font-bold text-white drop-shadow-sm">
                  너만의 추천메뉴 찾는 중
                </p>
                {pendingInfo && (
                  <SlotMachine
                    key={pendingInfo.targetIdx}
                    items={pendingInfo.reel}
                    targetIdx={pendingInfo.targetIdx}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => navigate(`/info/${recommendation.menuId}`)}
            disabled={showOverlay}
            className="relative block w-full text-left disabled:cursor-default"
          >
            <div className="bg-gradient-to-br from-white via-white to-[#fff0f0]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={recommendation.menuId}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="flex h-[200px] flex-col px-5 py-5 pr-[160px]"
                >
                  <span className="text-[12px] font-bold tracking-wide text-[#e31e2d]">
                    오늘의 추천 메뉴
                  </span>
                  <span className="mt-2 text-[22px] font-bold leading-tight text-black">
                    {recommendation.menuName}
                  </span>
                  <span className="mt-1.5 text-[18px] font-bold leading-none text-[#333]">
                    {recommendation.price.toLocaleString()}원
                  </span>
                  <div className="mt-auto flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#a0a0a0]" />
                      <span className="text-[13px] font-medium text-[#606060]">
                        {recommendation.restaurant}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {recommendation.imageUrl ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={recommendation.menuId}
                    src={recommendation.imageUrl}
                    alt={recommendation.menuName}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    draggable={false}
                    className="absolute right-0 top-0 h-full w-[148px] object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute right-0 top-0 flex h-full w-[148px] items-center justify-center bg-[#fce8ea]">
                  <img src={hobanWoo} alt="" className="h-24 w-auto opacity-80" draggable={false} />
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute right-3 top-3 z-20 flex size-7 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
          >
            <Pencil size={13} className="text-[#606060]" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <FoodPreferenceModal
          onClose={() => setIsModalOpen(false)}
          onSave={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
