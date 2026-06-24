import { AnimatePresence, motion } from 'framer-motion'
import { X, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MealMenuItem from '@/components/home/MealMenuItem'
import type { CafeteriaInfo } from './types'

type Props = {
  cafeteria: CafeteriaInfo | null
  onClose: () => void
}

export default function CafeteriaBottomSheet({ cafeteria, onClose }: Props) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {cafeteria && (
        <>
          <motion.div
            className="fixed inset-0 z-30 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-h-[70dvh] w-full max-w-150 flex-col rounded-t-[20px] bg-white"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* 핸들 + 헤더 (고정) */}
            <div className="shrink-0 px-5 pb-3 pt-4">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#e0e0e0]" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#fce8ea]">
                    <MapPin size={20} className="text-[#e31e2d]" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-black">{cafeteria.name}</p>
                    <p className="text-[12px] text-[#a0a0a0]">{cafeteria.building}</p>
                  </div>
                </div>
                <button type="button" onClick={onClose}>
                  <X size={20} className="text-[#a0a0a0]" />
                </button>
              </div>
            </div>

            {/* 메뉴 목록 (스크롤) */}
            <div className="overflow-y-auto pb-8">
              {cafeteria.menus.length === 0 ? (
                <p className="py-8 text-center text-[14px] text-[#a0a0a0]">
                  등록된 메뉴가 없습니다.
                </p>
              ) : (
                <div className="mx-5 overflow-hidden rounded-xl border border-[#f0f0f0]">
                  {cafeteria.menus.map((menu) => (
                    <button
                      key={menu.menuId}
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        onClose()
                        navigate(`/info/${menu.menuId}`)
                      }}
                    >
                      <MealMenuItem
                        name={menu.name}
                        price={menu.price}
                        rating={menu.rating}
                        isPopular={menu.isPopular}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
