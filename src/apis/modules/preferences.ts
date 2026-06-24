import { httpGet } from '../http'
import { ENDPOINTS } from '../endpoints'
import type { PreferenceKeywordResponse } from '../types'

export const getPreferenceKeywords = () =>
  httpGet<PreferenceKeywordResponse[]>(ENDPOINTS.PREFERENCES.KEYWORDS)
