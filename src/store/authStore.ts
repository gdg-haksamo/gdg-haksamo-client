import { create } from 'zustand'

type AuthState = {
  isLoggedIn: boolean
  nickname: string | null
  setAuth: (nickname: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  nickname: null,
  setAuth: (nickname) => set({ isLoggedIn: true, nickname }),
  clearAuth: () => set({ isLoggedIn: false, nickname: null }),
}))
