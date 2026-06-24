import { httpGet, httpPatch } from '../http'
import { ENDPOINTS } from '../endpoints'
import type {
  MyPageResponse,
  FavoriteRestaurantsUpdateRequest,
  KeywordCode,
  PreferencesUpdateRequest,
  NotificationSettingsUpdateRequest,
  NotificationSettingsResponse,
} from '../types'

export const getMyPage = () => httpGet<MyPageResponse>(ENDPOINTS.ME.PROFILE)

export const updateFavoriteRestaurants = (restaurantIds: number[]) =>
  httpPatch(ENDPOINTS.ME.FAVORITE_RESTAURANTS, {
    restaurantIds,
  } satisfies FavoriteRestaurantsUpdateRequest)

export const updatePreferences = (keywords: KeywordCode[]) =>
  httpPatch(ENDPOINTS.ME.PREFERENCES, { keywords } satisfies PreferencesUpdateRequest)

export const updateNotificationSettings = (data: NotificationSettingsUpdateRequest) =>
  httpPatch<NotificationSettingsResponse>(ENDPOINTS.ME.NOTIFICATION_SETTINGS, data)
