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
  description?: string
  location?: string
  startDate?: string
  endDate?: string
}

export const MOCK_NOTICE_ITEMS: NoticeItem[] = [
  {
    id: 1,
    type: 'event',
    tags: ['이벤트'],
    title: '메인 이벤트',
    date: '2026년 3월 16일',
    description: '티켓에 분과별 스티커를 모아오세요!',
    location: '일청담 및 백양로 일대',
    startDate: '2026년 03월 16일 19시 00분',
    endDate: '2026년 03월 18일 03시 00분',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=360&h=200&fit=crop',
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
    description: '리뷰를 작성하고 상품권을 받아가세요!',
    location: '학생복지관 1층',
    startDate: '2026년 05월 15일 09시 00분',
    endDate: '2026년 05월 31일 23시 59분',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=360&h=200&fit=crop',
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
