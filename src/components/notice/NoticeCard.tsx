import { ChevronRight, Megaphone, Gift } from 'lucide-react'
import type { NoticeItem, NoticeTag } from '@/mocks/notice'

const TAG_STYLE: Record<NoticeTag, string> = {
  중요: 'bg-[#e31e2d] text-white',
  공지: 'bg-[#f0f0f0] text-[#a0a0a0]',
  이벤트: 'bg-[#ffedd4] text-[#f54a00]',
}

type NoticeCardProps = {
  item: NoticeItem
}

export default function NoticeCard({ item }: NoticeCardProps) {
  const isEvent = item.type === 'event'

  const Icon = isEvent ? Gift : Megaphone
  const iconBg = isEvent ? 'bg-[#fce8ea]' : 'bg-[#f0f0f0]'
  const iconColor = isEvent ? 'text-[#e31e2d]' : 'text-[#a0a0a0]'

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full overflow-hidden rounded-[12px] border border-[#f0f0f0] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
    >
      {item.image && (
        <img src={item.image} alt={item.title} className="h-[140px] w-full object-cover" />
      )}

      <div className="flex h-[80px] items-center justify-between px-[15px]">
        <div className="flex items-start gap-3">
          <div
            className={`flex shrink-0 size-[28px] items-center justify-center rounded-full ${iconBg}`}
          >
            <Icon size={16} className={iconColor} />
          </div>

          <div className="flex flex-col items-start">
            <div className="flex gap-[5px]">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-[20px] px-2 py-1 text-[10px] font-semibold ${TAG_STYLE[tag]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-1 text-[12px] font-semibold text-black">{item.title}</span>
            <span className="text-[10px] text-[#a0a0a0]">{item.date}</span>
          </div>
        </div>

        <ChevronRight size={20} className="shrink-0 text-[#a0a0a0]" />
      </div>
    </a>
  )
}
