export const RESTAURANT_TABS = [
  '전체',
  '정보센터',
  '복지관',
  '카페테리아 첨성',
  '글로벌플라자',
  '공식당 학생식당',
  '공식당 교직원식당',
] as const
export type RestaurantTab = (typeof RESTAURANT_TABS)[number]

export function tabToRestaurant(tab: RestaurantTab): string | null {
  return tab === '전체' ? null : tab
}

export function restaurantToTab(restaurant: string): RestaurantTab {
  if (!restaurant) return '전체'

  const match = RESTAURANT_TABS.find(
    (tab) =>
      tab !== '전체' &&
      (tab === restaurant || tab.includes(restaurant) || restaurant.includes(tab)),
  )

  return match ?? '전체'
}
