import { create } from "zustand";
import { registerUser, loginUser } from "../api/auth";

// Read any existing session on load, so a page refresh doesn't log the
// user out — the token itself is the source of truth, this store just
// mirrors it into React state for components to read reactively.
const storedToken = localStorage.getItem("dsav_token");
const storedUsername = localStorage.getItem("dsav_username");

export const useAuthStore = create((set) => ({
  token: storedToken || null,
  username: storedUsername || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,

  register: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { token, username } = await registerUser(credentials);
      localStorage.setItem("dsav_token", token);
      localStorage.setItem("dsav_username", username);
      set({ token, username, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Registration failed",
      });
      return false;
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { token, username } = await loginUser(credentials);
      localStorage.setItem("dsav_token", token);
      localStorage.setItem("dsav_username", username);
      set({ token, username, isAuthenticated: true, loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Login failed",
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("dsav_token");
    localStorage.removeItem("dsav_username");
    set({ token: null, username: null, isAuthenticated: false });
  },
}));