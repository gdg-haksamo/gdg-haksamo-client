import { useState } from 'react'
import SegmentTabMenu from '@/components/notice/SegmentTabMenu'
import NoticeCard from '@/components/notice/NoticeCard'
import { MOCK_NOTICE_ITEMS } from '@/mocks/notice'
import type { NoticeType } from '@/mocks/notice'

const TABS = ['전체', '공지사항', '이벤트'] as const
type Tab = (typeof TABS)[number]

const TAB_TYPE_MAP: Record<Tab, NoticeType | null> = {
  전체: null,
  공지사항: 'notice',
  이벤트: 'event',
}

export default function NoticePage() {
  const [activeTab, setActiveTab] = useState<Tab>('전체')

  const filteredItems = MOCK_NOTICE_ITEMS.filter((item) => {
    const type = TAB_TYPE_MAP[activeTab]
    return type === null || item.type === type
  })

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <SegmentTabMenu tabs={[...TABS]} activeTab={activeTab} onChange={setActiveTab} />
      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => (
          <NoticeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
