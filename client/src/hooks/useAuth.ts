import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export function useAuth() {
  const token = localStorage.getItem("token");
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: !!token,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!token && !!user,
  };
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
