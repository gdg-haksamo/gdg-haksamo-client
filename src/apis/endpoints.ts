export const ENDPOINTS = {
  AUTH: {
    SEND_CODE: '/api/auth/email/send-code',
    VERIFY_CODE: '/api/auth/email/verify-code',
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    REISSUE: '/api/auth/reissue',
    LOGOUT: '/api/auth/logout',
  },
  MENUS: {
    LIST: '/api/menus',
    DETAIL: (menuId: number) => `/api/menus/${menuId}`,
    REVIEWS: (menuId: number) => `/api/menus/${menuId}/reviews`,
    RATING_DISTRIBUTION: (menuId: number) => `/api/menus/${menuId}/rating-distribution`,
  },
  REVIEWS: {
    HELPFUL: (reviewId: number) => `/api/reviews/${reviewId}/helpful`,
    DELETE: (reviewId: number) => `/api/reviews/${reviewId}`,
  },
  RESTAURANTS: {
    LIST: '/api/restaurants',
    MENUS: (restaurantId: number) => `/api/restaurants/${restaurantId}/menus`,
  },
  ME: {
    PROFILE: '/api/me',
    FAVORITE_RESTAURANTS: '/api/me/favorite-restaurants',
    PREFERENCES: '/api/me/preferences',
    NOTIFICATION_SETTINGS: '/api/me/notification-settings',
  },
  PREFERENCES: {
    KEYWORDS: '/api/preferences/keywords',
  },
  EVENTS: {
    LIST: '/api/events',
    DETAIL: (eventId: number) => `/api/events/${eventId}`,
  },
  USERS: {
    FCM_TOKEN: '/api/users/me/fcm-token',
  },
  RECOMMENDATIONS: {
    TODAY: '/api/recommendations/today',
    REFRESH: '/api/recommendations/today/refresh',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER: (userId: number) => `/api/admin/users/${userId}`,
    USER_ROLE: (userId: number) => `/api/admin/users/${userId}/role`,
    USER_PASSWORD: (userId: number) => `/api/admin/users/${userId}/password`,
    RESTAURANT_ADMIN: '/api/admin/users/restaurant-admin',
    CRAWL: '/api/admin/menus/crawl',
    MENUS_MANAGE: '/api/menus/manage',
    MENU_SOLD_OUT: (scheduleId: number) => `/api/menus/schedules/${scheduleId}/sold-out`,
  },
} as const
