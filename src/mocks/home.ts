import type { MealMenuItemType } from '@/components/home/MealMenuItem'

export type RecommendedMenuType = {
  label: string
  name: string
  price: number
  rating: number
  location: string
  image: string
}

export const MOCK_RECOMMENDED_MENUS: RecommendedMenuType[] = [
  {
    label: '오늘의 추천 메뉴',
    name: '쟁반수육',
    price: 8000,
    rating: 4.2,
    location: '공식당',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=144&h=181&fit=crop',
  },
  {
    label: '오늘의 추천 메뉴',
    name: '제육볶음',
    price: 7000,
    rating: 3.9,
    location: '복지관',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=144&h=181&fit=crop',
  },
  {
    label: '오늘의 추천 메뉴',
    name: '된장찌개',
    price: 6000,
    rating: 4.5,
    location: '정보센터',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=144&h=181&fit=crop',
  },
  {
    label: '오늘의 추천 메뉴',
    name: '돈가스',
    price: 8000,
    rating: 4.8,
    location: '공식당',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=144&h=181&fit=crop',
  },
]

export const MOCK_BREAKFAST_ITEMS: MealMenuItemType[] = [
  { name: '된장찌개', rating: 4.5, price: 6000 },
  { name: '계란후라이', rating: 4.2, price: 5000 },
  { name: '잡채', rating: 4.8, price: 6500 },
]

export const MOCK_LUNCH_ITEMS: MealMenuItemType[] = [
  { name: '치킨난반&매콤볶음밥', rating: 5.0, price: 8000, isPopular: true },
  { name: '돼지고기 김치구이 (2인)', rating: 5.0, price: 8000, isPopular: true },
  { name: '등심돈가스&스프', rating: 5.0, price: 8000 },
  { name: '땡초우동&주먹밥', rating: 5.0, price: 8000 },
  { name: '라면', rating: 5.0, price: 8000 },
]

export const MOCK_DINNER_ITEMS: MealMenuItemType[] = [
  { name: '김치볶음밥', rating: 4.3, price: 7000 },
  { name: '순두부찌개', rating: 4.6, price: 6000 },
  { name: '제육볶음', rating: 4.9, price: 8000 },
]
