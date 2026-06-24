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
    LIST: '/menus',
    DETAIL: (menuId: number) => `/menus/${menuId}`,
    REVIEWS: (menuId: number) => `/menus/${menuId}/reviews`,
    RATING_DISTRIBUTION: (menuId: number) => `/menus/${menuId}/rating-distribution`,
  },
  REVIEWS: {
    HELPFUL: (reviewId: number) => `/reviews/${reviewId}/helpful`,
    DELETE: (reviewId: number) => `/admin/reviews/${reviewId}`,
  },
  RESTAURANTS: {
    LIST: '/restaurants',
    MENUS: (restaurantId: number) => `/restaurants/${restaurantId}/menus`,
  },
  ME: {
    PROFILE: '/me',
    FAVORITE_RESTAURANTS: '/me/favorite-restaurants',
    PREFERENCES: '/me/preferences',
    NOTIFICATION_SETTINGS: '/me/notification-settings',
  },
  PREFERENCES: {
    KEYWORDS: '/preferences/keywords',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (eventId: number) => `/events/${eventId}`,
  },
  USERS: {
    FCM_TOKEN: '/api/users/me/fcm-token',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER: (userId: number) => `/api/admin/users/${userId}`,
    USER_ROLE: (userId: number) => `/api/admin/users/${userId}/role`,
    USER_PASSWORD: (userId: number) => `/api/admin/users/${userId}/password`,
    RESTAURANT_ADMIN: '/api/admin/users/restaurant-admin',
  },
} as const
