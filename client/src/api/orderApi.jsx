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
    throw new Error(data.message || "Unable to complete request");
  }

  return data;
};

export const createOrderApi = (payload) => request("/orders", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const getMyOrdersApi = () => request("/orders/my");
