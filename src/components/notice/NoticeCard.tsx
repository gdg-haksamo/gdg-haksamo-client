import { ChevronRight } from 'lucide-react'
import type { NoticeItem, NoticeTag } from '@/mocks/notice'

const TAG_STYLE_COMPACT: Record<NoticeTag, string> = {
  공지: 'bg-[#f0f0f0] text-[#606060]',
  이벤트: 'bg-[#ffedd4] text-[#f54a00]',
}

type NoticeCardProps = {
  item: NoticeItem
}

function EventCard({ item }: NoticeCardProps) {
  const dateLabel =
    item.startDate && item.endDate
      ? `${item.startDate} ~ ${item.endDate}`
      : (item.startDate ?? item.date)

  const inner = (
    <>
      <div className="w-1 shrink-0 bg-[#f54a00]" />
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
          <p className="text-[11px] text-[#a0a0a0]">{dateLabel}</p>
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
