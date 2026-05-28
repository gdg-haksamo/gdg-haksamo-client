export type Restaurant = '공식당' | '정보센터' | '복지관' | '카페테리아 첨성'

export type ReviewSort = '최신순' | '인기순' | '별점높은순' | '별점낮은순'

export type ReviewItem = {
  id: string
  restaurant: Restaurant
  menuName: string
  authorName: string
  date: string
  rating: number
  likeCount: number
  content: string
}

export const REVIEW_RESTAURANTS: Restaurant[] = ['공식당', '정보센터', '복지관', '카페테리아 첨성']

export const REVIEW_SORT_OPTIONS: ReviewSort[] = ['최신순', '인기순', '별점높은순', '별점낮은순']

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    restaurant: '공식당',
    menuName: '쟁반수육',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 5,
    likeCount: 24,
    content: '고기가 정말 부드럽고 맛있었어요! 양도 많고 가성비 최고입니다.',
  },
  {
    id: 'r2',
    restaurant: '공식당',
    menuName: '쟁반수육',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 4,
    likeCount: 24,
    content: '고기가 정말 부드럽고 맛있었어요! 양도 많고 가성비 최고입니다.',
  },
  {
    id: 'r3',
    restaurant: '정보센터',
    menuName: '비빔밥',
    authorName: '김민준',
    date: '2026년 5월 15일',
    rating: 3,
    likeCount: 12,
    content: '무난하게 맛있고 야채가 신선했어요. 다음엔 다른 메뉴도 먹어보고 싶어요.',
  },
  {
    id: 'r4',
    restaurant: '복지관',
    menuName: '돈가스',
    authorName: '김민준',
    date: '2026년 5월 14일',
    rating: 5,
    likeCount: 48,
    content: '바삭하고 소스가 딱 좋았어요. 배고플 때 먹으면 진짜 든든합니다.',
  },
  {
    id: 'r5',
    restaurant: '카페테리아 첨성',
    menuName: '샐러드',
    authorName: '김민준',
    date: '2026년 5월 12일',
    rating: 2,
    likeCount: 3,
    content: '양이 조금 아쉬웠지만 가볍게 먹기엔 괜찮았어요.',
  },
]
