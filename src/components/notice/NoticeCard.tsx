import { ChevronRight } from 'lucide-react'
import type { NoticeItem, NoticeTag } from '@/mocks/notice'

const TAG_STYLE: Record<NoticeTag, string> = {
  중요: 'bg-[#e31e2d] text-white',
  공지: 'bg-white/20 text-white backdrop-blur-sm',
  이벤트: 'bg-[#ffedd4] text-[#f54a00]',
}

const TAG_STYLE_COMPACT: Record<NoticeTag, string> = {
  중요: 'bg-[#e31e2d] text-white',
  공지: 'bg-[#f0f0f0] text-[#606060]',
  이벤트: 'bg-[#ffedd4] text-[#f54a00]',
}

type NoticeCardProps = {
  item: NoticeItem
}

export default function NoticeCard({ item }: NoticeCardProps) {
  const isImportant = item.tags.includes('중요')
  const isEvent = item.type === 'event'

  if (item.image) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-[16px] shadow-[0px_6px_16px_0px_rgba(0,0,0,0.14)]"
      >
        <div className="relative h-[200px]">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${TAG_STYLE[tag]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[15px] font-bold leading-snug text-white">{item.title}</p>
            <p className="mt-1 text-[11px] text-white/60">{item.date}</p>
          </div>
        </div>
      </a>
    )
  }

  const accentColor = isImportant || isEvent ? 'bg-[#e31e2d]' : 'bg-[#e0e0e0]'

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex overflow-hidden rounded-[12px] bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]"
    >
      <div className={`w-1 shrink-0 ${accentColor}`} />
      <div className="flex flex-1 items-center justify-between px-4 py-[18px]">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TAG_STYLE_COMPACT[tag]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-[14px] font-semibold leading-snug text-black">{item.title}</p>
          <p className="text-[11px] text-[#a0a0a0]">{item.date}</p>
        </div>
        <ChevronRight size={18} className="ml-3 shrink-0 text-[#c0c0c0]" />
      </div>
    </a>
  )
}
