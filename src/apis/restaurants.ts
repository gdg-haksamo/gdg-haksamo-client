import { httpGet } from './http'
import { ENDPOINTS } from './endpoints'
import type { RestaurantResponse, RestaurantMenuResponse } from './types'

export const getRestaurants = () => httpGet<RestaurantResponse[]>(ENDPOINTS.RESTAURANTS.LIST)

export const getRestaurantMenus = (restaurantId: number) =>
  httpGet<RestaurantMenuResponse[]>(ENDPOINTS.RESTAURANTS.MENUS(restaurantId))
