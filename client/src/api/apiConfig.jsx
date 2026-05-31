const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const localApiUrl = "http://localhost:5000/api";

export const API_URL = configuredApiUrl || (import.meta.env.DEV ? localApiUrl : "");

export const assertApiUrl = () => {
  if (!API_URL) {
    throw new Error("Backend URL is missing. Set VITE_API_URL in Vercel to your Render backend URL.");
  }
};

const TOKEN_KEY = "zhatpat_token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
