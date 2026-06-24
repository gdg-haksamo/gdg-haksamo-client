import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SegmentTabMenu from '@/components/notice/SegmentTabMenu'
import NoticeCard from '@/components/notice/NoticeCard'
import { getEvents } from '@/apis/events'
import type { NoticeItem } from '@/mocks/notice'
import hobanWoo from '@/assets/hoban-woo.svg'

const TABS = ['전체', '공지사항', '이벤트'] as const
type Tab = (typeof TABS)[number]

function formatKoreanDate(dateStr: string): string {
  const [year, month, day] = dateStr.slice(0, 10).split('-')
  return `${year}년 ${month}월 ${day}일`
}

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<Tab>('전체')

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const items: NoticeItem[] = (events ?? []).map((e) => {
    const isEvent = e.type === 'EVENT'
    return {
      id: e.eventId,
      type: isEvent ? 'event' : 'notice',
      tags: isEvent ? ['이벤트'] : ['공지'],
      title: e.title,
      date: e.createdAt.slice(0, 10),
      image: e.imageUrl ?? undefined,
      url: e.linkUrl ?? undefined,
      description: e.content ?? undefined,
      startDate: e.startDate ? formatKoreanDate(e.startDate) : undefined,
      endDate: e.endDate ? formatKoreanDate(e.endDate) : undefined,
    }
  })

  const filteredItems = items.filter((item) => {
    if (activeTab === '전체') return true
    if (activeTab === '공지사항') return item.type === 'notice'
    return item.type === 'event'
  })

  return (
    <div className="flex flex-col px-5 py-4">
      <div className="mb-2 flex items-center gap-3">
        <img src={hobanWoo} alt="호반우" className="h-16 w-auto" />
        <p className="text-[18px] font-bold leading-snug text-black">현재 진행 중인 이벤트</p>
      </div>

      <SegmentTabMenu tabs={[...TABS]} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-4 flex flex-col gap-3">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e31e2d] border-t-transparent" />
          </div>
        )}
        {isError && (
          <p className="py-8 text-center text-[14px] text-[#e31e2d]">
            불러오기에 실패했습니다. 다시 시도해주세요.
          </p>
        )}
        {!isLoading && !isError && filteredItems.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#a0a0a0]">등록된 이벤트가 없습니다</p>
        )}
        {!isLoading &&
          !isError &&
          filteredItems.map((item) => <NoticeCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
