export interface ApiResponse<T = void> {
  success: boolean
  code?: string
  message?: string
  data: T
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface SendCodeRequest {
  email: string
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface SignUpRequest {
  email: string
  password: string
  nickname: string
  department?: string
  restaurantId?: number
  keywords?: KeywordCode[]
}

export interface SignUpResponse {
  userId: number
  email: string
  nickname: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  accessTokenExpiresIn: number
}

// ── Menu ──────────────────────────────────────────────────────────────────────

export interface MenuResponse {
  menuId?: number
  restaurant: string
  menuName: string
  price: number
  averageRating: number | null
  soldOut?: boolean
}

export interface MealMenusResponse {
  count: number
  menus: MenuResponse[]
}

export interface MenusByMealTimeResponse {
  breakfast: MealMenusResponse
  lunch: MealMenusResponse
  dinner: MealMenusResponse
}

export interface NutritionInfo {
  calories: number | null
  protein: number | null
  carb: number | null
  fat: number | null
}

export interface PopularReviewResponse {
  userId: number
  authorNickname: string
  createdAt: string
  rating: number
  content: string | null
  helpfulCount: number
}

export interface MenuDetailResponse {
  menuName: string
  price: number
  restaurant: string
  soldOut?: boolean
  operatingTime: string | null
  description: string | null
  imageUrl: string | null
  nutrition: NutritionInfo
  averageRating: number | null
  reviewCount: number
  popularReviews: PopularReviewResponse[]
}

// ── Review ────────────────────────────────────────────────────────────────────

export interface ReviewRequest {
  rating: number
  content?: string
}

export interface ReviewResponse {
  reviewId: number
  userId: number
  rating: number
  content: string | null
  createdAt: string
  helpfulCount: number
}

export interface RatingDistributionResponse {
  totalCount: number
  distribution: Record<string, number>
}

// ── Restaurant ────────────────────────────────────────────────────────────────

export interface RestaurantResponse {
  restaurantId: number
  name: string
}

export interface RestaurantMenuResponse {
  menuId: number
  name: string
  price: number
}

// ── MyPage ────────────────────────────────────────────────────────────────────

export interface NotificationSettingsResponse {
  pushNotificationEnabled: boolean
  breakfast: boolean
  lunch: boolean
  dinner: boolean
  event: boolean
}

export interface MyPageResponse {
  userId?: number
  nickname: string
  department: string
  role?: UserRole
  managedRestaurantId?: number | null
  reviewCount: number
  helpfulReceivedCount: number
  activeEventCount: number | null
  favoriteRestaurant: RestaurantResponse | null
  preferenceKeywords: string[]
  notificationSettings: NotificationSettingsResponse
}

export interface FavoriteRestaurantsUpdateRequest {
  restaurantId: number | null
}

export type KeywordCode =
  | 'SPICY'
  | 'MILD'
  | 'SWEET'
  | 'SOUR'
  | 'NOODLE'
  | 'RICE'
  | 'MEAT'
  | 'SEAFOOD'
  | 'VEGETARIAN'
  | 'SOUP'
  | 'SALAD'
  | 'SANDWICH'
  | 'KOREAN'
  | 'CHINESE'
  | 'JAPANESE'
  | 'WESTERN'
  | 'LOW_CALORIE'
  | 'HIGH_PROTEIN'

export interface PreferencesUpdateRequest {
  keywords: KeywordCode[]
}

export interface NotificationSettingsUpdateRequest {
  pushNotificationEnabled?: boolean
  breakfast?: boolean
  lunch?: boolean
  dinner?: boolean
  event?: boolean
}

export interface PreferenceKeywordResponse {
  name: KeywordCode
  category: string
  label: string
}

// ── Event ─────────────────────────────────────────────────────────────────────

export interface EventResponse {
  eventId: number
  type: 'EVENT' | 'NOTICE'
  title: string
  content: string | null
  imageUrl: string | null
  linkUrl: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
}

export interface EventRequest {
  type: 'EVENT' | 'NOTICE'
  title: string
  content?: string
  imageUrl?: string
  linkUrl?: string
  startDate?: string
  endDate?: string
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'RESTAURANT_ADMIN' | 'SUPER_ADMIN'

export type MealTime = 'BREAKFAST' | 'LUNCH' | 'DINNER'

export interface ManagedMenuResponse {
  scheduleId: number
  menuId: number
  name: string
  price: number
  time: MealTime
  date: string
  soldOut: boolean
}

export interface MenuAdminResponse {
  menuId: number
  restaurantId: number
  name: string
  price: number
  category: string | null
  imageUrl: string | null
}

export interface CreateMenuRequest {
  restaurantId: number
  name: string
  price: number
  time: MealTime
  category?: string
}

export interface UpdateMenuRequest {
  name?: string
  price?: number
}

export interface AdminUserResponse {
  userId: number
  email: string
  nickname: string
  role: UserRole
  managedRestaurantId: number | null
}

export interface AdminUserListResponse {
  users: AdminUserResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface CreateRestaurantAdminRequest {
  email: string
  password: string
  nickname: string
  restaurantId: number
}

export interface UpdateUserRoleRequest {
  role: UserRole
  managedRestaurantId?: number
}

export interface ResetPasswordRequest {
  newPassword: string
}

// ── Recommendation ────────────────────────────────────────────────────────────

export interface TodayRecommendationResponse {
  menuId: number
  menuName: string
  restaurant: string
  price: number
  category: string | null
  imageUrl: string | null
  description: string | null
  nutrition: NutritionInfo
  date: string
  meal: MealTime
  refreshCount: number
  totalCount: number
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface FcmTokenRequest {
  fcmToken: string
}
