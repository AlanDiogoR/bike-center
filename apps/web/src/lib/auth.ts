import { useAuthStore } from "@/store/auth.store";

/** Armazena token e user no store Zustand (em memória, sem localStorage) */
export function setAuth(
  token: string,
  user: { id: string; email: string; name: string; phone: string; role: string }
) {
  useAuthStore.getState().setAuth(token, user);
}

/** @deprecated Use useAuthStore.getState().getToken() direto */
export function getToken(): string | null {
  return useAuthStore.getState().getToken();
}

/** @deprecated Use useAuthStore.getState().getUser() direto */
export function getUser(): {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
} | null {
  return useAuthStore.getState().getUser();
}

/** @deprecated Use useAuthStore.getState().clearAuth() direto */
export function clearAuth() {
  useAuthStore.getState().clearAuth();
}

export function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
