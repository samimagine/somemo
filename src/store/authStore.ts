import { create } from "zustand";

interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  token: null,
  isAuthenticated: false,
  login: (username, token) => {
    set({
      username,
      token,
      isAuthenticated: true,
    });
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  },
  logout: () => {
    set({
      username: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  },
}));
