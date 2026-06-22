import type { Restaurant } from '@/mocks/review'

export const RESTAURANT_TABS = ['전체', '공식당', '정보센터', '복지관', '카페테리아 첨성'] as const
export type RestaurantTab = (typeof RESTAURANT_TABS)[number]

export function tabToRestaurant(tab: RestaurantTab): Restaurant | null {
  return tab === '전체' ? null : tab
}
