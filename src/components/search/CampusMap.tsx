import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import campusMap from '@/assets/campus-map.svg'
import cafeteriaMarker from '@/assets/cafeteria-marker.svg'
import type { CafeteriaInfo } from '@/mocks/search'

const MIN_SCALE = 1
const MAX_SCALE = 4
const SCALE_STEP = 0.5

const MAP_ASPECT = 3404 / 2942

type Constraints = { top: number; bottom: number; left: number; right: number }

type Props = {
  cafeterias: CafeteriaInfo[]
  highlightedIds: string[]
  onMarkerClick: (cafeteria: CafeteriaInfo) => void
}

export default function CampusMap({ cafeterias, highlightedIds, onMarkerClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(MIN_SCALE)
  const [scale, setScale] = useState(MIN_SCALE)
  const [constraints, setConstraints] = useState<Constraints>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const computeConstraints = useCallback((s: number): Constraints => {
    if (!containerRef.current) return { top: 0, bottom: 0, left: 0, right: 0 }
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect()
    const mapH = cw * MAP_ASPECT
    const halfX = Math.max(0, (cw * s - cw) / 2)
    const maxUp = Math.max(0, mapH * s - ch)
    return { left: -halfX, right: halfX, top: -maxUp, bottom: 0 }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect()
    const mapH = cw * MAP_ASPECT
    const computed = Math.max(MIN_SCALE, ch / mapH)
    setFitScale(computed)
    setScale(computed)
    setConstraints(computeConstraints(computed))
  }, [computeConstraints])

  const handleZoom = (newScale: number) => {
    const ratio = newScale / scale
    const c = computeConstraints(newScale)
    x.set(Math.max(c.left, Math.min(c.right, x.get() * ratio)))
    y.set(Math.max(c.top, Math.min(c.bottom, y.get() * ratio)))
    setScale(newScale)
    setConstraints(c)
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-white">
      <motion.div
        drag={scale > MIN_SCALE}
        dragMomentum={false}
        dragConstraints={constraints}
        style={{ x, y, scale }}
        className="relative origin-top"
      >
        <img src={campusMap} alt="캠퍼스 지도" className="block w-full" draggable={false} />
        <div className="absolute inset-0">
          {cafeterias.map((cafe) => {
            const isHighlighted = highlightedIds.includes(cafe.id)
            const dimmed = highlightedIds.length > 0 && !isHighlighted

            return (
              <button
                key={cafe.id}
                type="button"
                onClick={() => onMarkerClick(cafe)}
                style={{
                  left: `${cafe.position.x}%`,
                  top: `${cafe.position.y}%`,
                  transform: `translate(-50%, -50%) scale(${1 / scale})`,
                }}
                className={`absolute p-0 transition-opacity duration-200 ${dimmed ? 'opacity-25' : 'opacity-100'}`}
              >
                {isHighlighted && (
                  <motion.div
                    className="pointer-events-none absolute -inset-2 rounded-full bg-[#e31e2d]/30"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  />
                )}
                <img src={cafeteriaMarker} alt={cafe.name} className="size-7" draggable={false} />
              </button>
            )
          })}
        </div>
      </motion.div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => handleZoom(Math.min(scale + SCALE_STEP, MAX_SCALE))}
          disabled={scale >= MAX_SCALE}
          className="flex size-9 items-center justify-center rounded-lg bg-white shadow-md disabled:opacity-40"
        >
          <Plus size={18} className="text-black" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(Math.max(scale - SCALE_STEP, fitScale))}
          disabled={scale <= fitScale}
          className="flex size-9 items-center justify-center rounded-lg bg-white shadow-md disabled:opacity-40"
        >
          <Minus size={18} className="text-black" />
        </button>
      </div>
    </div>
  )
}
