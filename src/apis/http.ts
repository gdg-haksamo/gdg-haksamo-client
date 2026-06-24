import axios from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    skipRefresh?: boolean
  }
  interface AxiosRequestConfig {
    skipRefresh?: boolean
  }
}
import { ApiError } from './error'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, TokenResponse } from './types'

// ── Access Token 저장소 ────────────────────────────────────────────────────────

const TOKEN_KEY = 'access_token'

export const getAccessToken = () => sessionStorage.getItem(TOKEN_KEY)
export const setAccessToken = (token: string | null) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

// ── Axios 인스턴스 ─────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// reissue 전용 — 인터셉터 없이 쿠키만으로 요청
const TIMEOUT_MS = 10_000

const baseAxios = axios.create({ baseURL: BASE_URL, withCredentials: true, timeout: TIMEOUT_MS })

const http = axios.create({ baseURL: BASE_URL, withCredentials: true, timeout: TIMEOUT_MS })

// ── Request Interceptor: Access Token 주입 ─────────────────────────────────────

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor: 401 자동 갱신 + 에러 변환 ────────────────────────────

let isRefreshing = false
let refreshQueue: ((token: string | null) => void)[] = []

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(http(originalRequest))
            } else {
              reject(new ApiError('AUTH_EXPIRED', '로그인이 만료되었습니다.', 401))
            }
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await baseAxios.post<ApiResponse<TokenResponse>>(ENDPOINTS.AUTH.REISSUE)
        const newToken = res.data.data.accessToken
        setAccessToken(newToken)
        processQueue(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return http(originalRequest)
      } catch {
        processQueue(null)
        setAccessToken(null)
        const { useAuthStore } = await import('../store/authStore')
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        throw new ApiError('AUTH_EXPIRED', '로그인이 만료되었습니다.', 401)
      } finally {
        isRefreshing = false
      }
    }

    const data = error.response?.data as ApiResponse<never> | undefined
    throw new ApiError(
      data?.code ?? 'UNKNOWN',
      data?.message ?? '알 수 없는 오류가 발생했습니다.',
      error.response?.status,
    )
  },
)

// ── 타입 안전 래퍼 ─────────────────────────────────────────────────────────────

export async function httpGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.get<ApiResponse<T>>(url, config)
  return res.data.data
}

export async function httpPost<T = void>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.post<ApiResponse<T>>(url, data, config)
  return res.data.data
}

export async function httpPatch<T = void>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.patch<ApiResponse<T>>(url, data, config)
  return res.data.data
}

export async function httpDelete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.delete<ApiResponse<T>>(url, config)
  return res.data.data
}

export async function httpPut<T = void>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.put<ApiResponse<T>>(url, data, config)
  return res.data.data
}

export default http
