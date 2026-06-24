import { httpGet, httpPost } from '../http'
import { ENDPOINTS } from '../endpoints'
import type { MealTime, TodayRecommendationResponse } from '../types'

export const getTodayRecommendation = (meal?: MealTime) =>
  httpGet<TodayRecommendationResponse>(ENDPOINTS.RECOMMENDATIONS.TODAY, {
    params: meal ? { meal } : undefined,
  })

export const refreshRecommendation = (meal?: MealTime) =>
  httpPost<TodayRecommendationResponse>(ENDPOINTS.RECOMMENDATIONS.REFRESH, undefined, {
    params: meal ? { meal } : undefined,
  })
