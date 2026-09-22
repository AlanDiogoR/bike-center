import { useAuthStore } from "@/store/auth.store";

export function getUser(): {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
} | null {
  return useAuthStore.getState().getUser();
}

export function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
