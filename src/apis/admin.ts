import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from './http'
import { ENDPOINTS } from './endpoints'
import type {
  AdminUserListResponse,
  CreateMenuRequest,
  CreateRestaurantAdminRequest,
  EventRequest,
  EventResponse,
  ManagedMenuResponse,
  MenuAdminResponse,
  ResetPasswordRequest,
  UpdateMenuRequest,
  UpdateUserRoleRequest,
} from './types'

// ── User Management ───────────────────────────────────────────────────────────

export const getAdminUsers = (page = 0, size = 20) =>
  httpGet<AdminUserListResponse>(ENDPOINTS.ADMIN.USERS, { params: { page, size } })

export const createRestaurantAdmin = (data: CreateRestaurantAdminRequest) =>
  httpPost(ENDPOINTS.ADMIN.RESTAURANT_ADMIN, data)

export const updateUserRole = (userId: number, data: UpdateUserRoleRequest) =>
  httpPatch(ENDPOINTS.ADMIN.USER_ROLE(userId), data)

export const resetUserPassword = (userId: number, data: ResetPasswordRequest) =>
  httpPatch(ENDPOINTS.ADMIN.USER_PASSWORD(userId), data)

export const deleteUser = (userId: number) => httpDelete(ENDPOINTS.ADMIN.USER(userId))

// ── Event Management ──────────────────────────────────────────────────────────

export const createEvent = (data: EventRequest) =>
  httpPost<EventResponse>(ENDPOINTS.EVENTS.LIST, data)

export const updateEvent = (eventId: number, data: EventRequest) =>
  httpPut<EventResponse>(ENDPOINTS.EVENTS.DETAIL(eventId), data)

export const deleteEvent = (eventId: number) => httpDelete(ENDPOINTS.EVENTS.DETAIL(eventId))

// ── Crawl ─────────────────────────────────────────────────────────────────────

export const triggerCrawl = () => httpPost(ENDPOINTS.ADMIN.CRAWL)

// ── Menu Management ───────────────────────────────────────────────────────────

export const getAdminMenus = (restaurantId?: number) =>
  httpGet<ManagedMenuResponse[]>(ENDPOINTS.ADMIN.MENUS_MANAGE, {
    params: restaurantId ? { restaurantId } : undefined,
  })

export const createAdminMenu = (data: CreateMenuRequest) =>
  httpPost<MenuAdminResponse>(ENDPOINTS.MENUS.LIST, data)

export const updateAdminMenu = (menuId: number, data: UpdateMenuRequest) =>
  httpPatch<MenuAdminResponse>(ENDPOINTS.MENUS.DETAIL(menuId), data)

export const deleteAdminMenu = (menuId: number) => httpDelete(ENDPOINTS.MENUS.DETAIL(menuId))

export const toggleSoldOut = (scheduleId: number) =>
  httpPatch(ENDPOINTS.ADMIN.MENU_SOLD_OUT(scheduleId))
