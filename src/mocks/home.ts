import type { MealMenuItemType } from '@/components/home/MealMenuItem'

export const MOCK_RECOMMENDED_MENU = {
  label: '오늘의 추천 메뉴',
  name: '쟁반수육',
  price: 8000,
  rating: 102,
  location: '공식당',
  image: 'https://placehold.co/144x181/f0f0f0/a0a0a0?text=food',
}

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
