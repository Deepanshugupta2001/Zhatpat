const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
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
