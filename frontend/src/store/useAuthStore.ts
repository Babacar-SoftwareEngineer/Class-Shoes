import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token: string, user: AuthUser) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'class-shoes-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
