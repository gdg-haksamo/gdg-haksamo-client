import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/apis/types'

type AuthState = {
  isLoggedIn: boolean
  nickname: string | null
  role: UserRole | null
  setAuth: (nickname: string, role?: UserRole) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      nickname: null,
      role: null,
      setAuth: (nickname, role) => set({ isLoggedIn: true, nickname, role: role ?? null }),
      clearAuth: () => set({ isLoggedIn: false, nickname: null, role: null }),
    }),
    { name: 'auth-storage' },
  ),
)
