import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setSession: (user: AuthUser) => set({ user }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: 'class-shoes-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
