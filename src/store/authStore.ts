import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/apis/types'

type AuthState = {
  isLoggedIn: boolean
  userId: number | null
  nickname: string | null
  role: UserRole | null
  managedRestaurantId: number | null
  setAuth: (
    nickname: string,
    role?: UserRole,
    managedRestaurantId?: number | null,
    userId?: number | null,
  ) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      nickname: null,
      role: null,
      managedRestaurantId: null,
      setAuth: (nickname, role, managedRestaurantId, userId) =>
        set({
          isLoggedIn: true,
          nickname,
          role: role ?? null,
          managedRestaurantId: managedRestaurantId ?? null,
          userId: userId ?? null,
        }),
      clearAuth: () =>
        set({
          isLoggedIn: false,
          userId: null,
          nickname: null,
          role: null,
          managedRestaurantId: null,
        }),
    }),
    { name: 'auth-storage' },
  ),
)
