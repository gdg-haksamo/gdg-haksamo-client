import { useEffect, useState } from 'react'
import { animate, AnimatePresence, motion, useMotionValue } from 'framer-motion'
import { MapPin, Pencil, Star } from 'lucide-react'
import { MOCK_RECOMMENDED_MENUS } from '@/mocks/home'
import FoodPreferenceModal from './FoodPreferenceModal'
import hobanWoo from '@/assets/hoban-woo.svg'

const ITEM_HEIGHT = 44
const LOOPS = 5

type Props = {
  menuIndex: number
  isRefreshing: boolean
}

function SlotMachine({ nextIndex }: { nextIndex: number }) {
  const reel = Array(LOOPS + 1)
    .fill(MOCK_RECOMMENDED_MENUS)
    .flat()
  const finalPos = LOOPS * MOCK_RECOMMENDED_MENUS.length + nextIndex
  const targetY = -(finalPos * ITEM_HEIGHT)
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
        {reel.map((menu, i) => (
          <div key={i} className="flex items-center justify-center" style={{ height: ITEM_HEIGHT }}>
            <span className="text-[16px] font-bold text-white drop-shadow-sm">{menu.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function RecommendedMenuCard({ menuIndex, isRefreshing }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const menu = MOCK_RECOMMENDED_MENUS[menuIndex]
  const nextIndex = (menuIndex + 1) % MOCK_RECOMMENDED_MENUS.length

  if (!menu) {
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
            {isRefreshing && (
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
                <SlotMachine key={nextIndex} nextIndex={nextIndex} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gradient-to-br from-white via-white to-[#fff0f0]">
            <AnimatePresence mode="wait">
              <motion.div
                key={menuIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex h-[200px] flex-col px-5 py-5 pr-[160px]"
              >
                <span className="text-[12px] font-bold tracking-wide text-[#e31e2d]">
                  {menu.label}
                </span>
                <span className="mt-2 text-[28px] font-bold leading-tight text-black">
                  {menu.name}
                </span>
                <span className="mt-1.5 text-[18px] font-bold leading-none text-[#333]">
                  {menu.price.toLocaleString()}원
                </span>
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#FFBB00] text-[#FFBB00]" />
                    <span className="text-[13px] font-semibold tabular-nums text-[#333]">
                      {menu.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#a0a0a0]" />
                    <span className="text-[13px] font-medium text-[#606060]">{menu.location}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.img
                key={menuIndex}
                src={menu.image}
                alt={menu.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute right-0 top-0 h-full w-[148px] object-cover"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="absolute right-3 top-3 z-20 flex size-7 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
            >
              <Pencil size={13} className="text-[#606060]" />
            </button>
          </div>
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
