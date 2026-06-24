import { ChevronRight, MapPin } from 'lucide-react'
import type { NoticeItem, NoticeTag } from '@/mocks/notice'

const TAG_STYLE_COMPACT: Record<NoticeTag, string> = {
  공지: 'bg-[#f0f0f0] text-[#606060]',
  이벤트: 'bg-[#ffedd4] text-[#f54a00]',
}

type NoticeCardProps = {
  item: NoticeItem
}

function EventCard({ item }: NoticeCardProps) {
  const inner = (
    <>
      <div className="h-45 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#7c6fd4]">
            <span className="text-[16px] font-bold text-white">{item.title}</span>
          </div>
        )}
      </div>

      <div className="px-4 pb-5 pt-4">
        <p className="text-[16px] font-bold text-black">{item.title}</p>
        {item.description && <p className="mt-1 text-[13px] text-[#808080]">{item.description}</p>}

        {item.location && (
          <div className="mt-3 flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-[#e31e2d]" />
            <span className="text-[13px] text-[#606060]">{item.location}</span>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2">
          {item.startDate && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#fce8ea] px-2.5 py-0.5 text-[11px] font-bold text-[#e31e2d]">
                시작
              </span>
              <span className="text-[12px] text-[#606060]">{item.startDate}</span>
            </div>
          )}
          {item.endDate && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#e31e2d] px-2.5 py-0.5 text-[11px] font-bold text-white">
                종료
              </span>
              <span className="text-[12px] text-[#606060]">{item.endDate}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl bg-white shadow-[0px_6px_16px_0px_rgba(0,0,0,0.14)]"
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0px_6px_16px_0px_rgba(0,0,0,0.14)]">
      {inner}
    </div>
  )
}

export default function NoticeCard({ item }: NoticeCardProps) {
  if (item.type === 'event') {
    return <EventCard item={item} />
  }

  const inner = (
    <>
      <div className="w-1 shrink-0 bg-[#e0e0e0]" />
      <div className="flex flex-1 items-center justify-between px-4 py-4.5">
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
    </>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex overflow-hidden rounded-xl bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]"
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="flex overflow-hidden rounded-xl bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]">
      {inner}
    </div>
  )
}
