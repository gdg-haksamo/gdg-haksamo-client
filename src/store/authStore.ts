import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  isLoggedIn: boolean
  nickname: string | null
  setAuth: (nickname: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      nickname: null,
      setAuth: (nickname) => set({ isLoggedIn: true, nickname }),
      clearAuth: () => set({ isLoggedIn: false, nickname: null }),
    }),
    { name: 'auth-storage' },
  ),
)
