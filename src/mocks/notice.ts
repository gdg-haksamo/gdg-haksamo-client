export type NoticeType = 'notice' | 'event'

export type NoticeTag = '공지' | '이벤트'

export type NoticeItem = {
  id: number
  type: NoticeType
  tags: NoticeTag[]
  title: string
  date: string
  image?: string
  url?: string
}

export const MOCK_NOTICE_ITEMS: NoticeItem[] = [
  {
    id: 1,
    type: 'event',
    tags: ['이벤트'],
    title: '천원의 아침밥 이벤트',
    date: '2026년 3월 1일',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=360&h=140&fit=crop',
    url: 'https://www.instagram.com/knu_studentunion/',
  },
  {
    id: 2,
    type: 'notice',
    tags: ['공지'],
    title: '5월 식단 변경 안내',
    date: '2026년 5월 15일',
    url: 'https://www.instagram.com/knu_studentunion/',
  },
  {
    id: 3,
    type: 'event',
    tags: ['이벤트'],
    title: '리뷰이벤트 - 상품권 증정',
    date: '2026년 5월 15일',
    url: 'https://www.instagram.com/knu_studentunion/',
  },
  {
    id: 4,
    type: 'notice',
    tags: ['공지'],
    title: '글로벌플라자 식당 임시 휴무',
    date: '2026년 5월 15일',
    url: 'https://www.instagram.com/knu_studentunion/',
  },
  {
    id: 5,
    type: 'notice',
    tags: ['공지'],
    title: '5월 식단 변경 안내',
    date: '2026년 5월 15일',
    url: 'https://www.instagram.com/knu_studentunion/',
  },
]
