import { API_URL, assertApiUrl, clearAuthToken, getAuthHeaders, setAuthToken } from "./apiConfig.jsx";

const request = async (path, options = {}) => {
  assertApiUrl();

  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

const authRequest = async (path, payload) => {
  const data = await request(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(data.token);
  return data;
};

export const registerCustomerApi = (payload) => authRequest("/auth/register/customer", payload);

export const registerSellerApi = (payload) => authRequest("/auth/register/seller", payload);

export const loginCustomerApi = (payload) => authRequest("/auth/login/customer", payload);

export const loginSellerApi = (payload) => authRequest("/auth/login/seller", payload);

export const getMeApi = () => request("/auth/me");

export const logoutApi = async () => {
  try {
    return await request("/auth/logout", { method: "POST" });
  } finally {
    clearAuthToken();
  }
};
