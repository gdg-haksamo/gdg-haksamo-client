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
            className="absolute inset-0 z-10 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 rounded-t-[20px] bg-white px-5 pb-8 pt-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#e0e0e0]" />

            <div className="mb-4 flex items-start justify-between">
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

            <div className="overflow-hidden rounded-[12px] border border-[#f0f0f0]">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
