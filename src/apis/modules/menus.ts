import { httpGet } from '../http'
import { ENDPOINTS } from '../endpoints'
import type { MenusByMealTimeResponse, MenuDetailResponse } from '../types'

export const getMenus = (date: string) =>
  httpGet<MenusByMealTimeResponse>(ENDPOINTS.MENUS.LIST, { params: { date } })

export const getMenuDetail = (menuId: number) =>
  httpGet<MenuDetailResponse>(ENDPOINTS.MENUS.DETAIL(menuId))
