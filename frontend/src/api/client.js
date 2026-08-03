import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every outgoing request automatically, if we have one.
// This is what makes every component's API calls "just work" once logged
// in, without each call manually reading the token itself.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("dsav_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever returns 401 (expired/invalid token), clear the
// stale token so the UI doesn't keep sending a dead one on every request.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("dsav_token");
      localStorage.removeItem("dsav_username");
    }
    return Promise.reject(error);
  }
);

export default apiClient;