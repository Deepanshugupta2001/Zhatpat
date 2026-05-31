import { API_URL, assertApiUrl } from "./apiConfig.jsx";

const request = async (path, options = {}) => {
  assertApiUrl();

  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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

export const registerCustomerApi = (payload) => request("/auth/register/customer", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const registerSellerApi = (payload) => request("/auth/register/seller", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const loginCustomerApi = (payload) => request("/auth/login/customer", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const loginSellerApi = (payload) => request("/auth/login/seller", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const getMeApi = () => request("/auth/me");

export const logoutApi = () => request("/auth/logout", { method: "POST" });
