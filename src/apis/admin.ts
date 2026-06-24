import { httpDelete, httpGet, httpPatch, httpPost, httpPut } from './http'
import { ENDPOINTS } from './endpoints'
import type {
  AdminMenuResponse,
  AdminUserListResponse,
  CreateMenuRequest,
  CreateRestaurantAdminRequest,
  EventRequest,
  EventResponse,
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

export const getAdminMenus = () => httpGet<AdminMenuResponse[]>(ENDPOINTS.ADMIN.MENUS)

export const createAdminMenu = (data: CreateMenuRequest) =>
  httpPost<AdminMenuResponse>(ENDPOINTS.ADMIN.MENUS, data)

export const updateAdminMenu = (menuId: number, data: UpdateMenuRequest) =>
  httpPut<AdminMenuResponse>(ENDPOINTS.ADMIN.MENU(menuId), data)

export const deleteAdminMenu = (menuId: number) => httpDelete(ENDPOINTS.ADMIN.MENU(menuId))

export const toggleSoldOut = (menuId: number, soldOut: boolean) =>
  httpPatch(ENDPOINTS.ADMIN.MENU_SOLD_OUT(menuId), { soldOut })
