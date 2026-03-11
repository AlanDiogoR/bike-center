import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  getToken: () => string | null;
  getUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  setAuth: (token, user) => set({ token, user }),

  clearAuth: () => set({ token: null, user: null }),

  getToken: () => get().token,

  getUser: () => get().user,
}));
