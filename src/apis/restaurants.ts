import { httpGet } from './http'
import { ENDPOINTS } from './endpoints'
import type { RestaurantResponse } from './types'

export const getRestaurants = () => httpGet<RestaurantResponse[]>(ENDPOINTS.RESTAURANTS.LIST)
