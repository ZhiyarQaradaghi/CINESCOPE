import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_SOCKET_SERVER || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response for ${response.config.url}:`, response.data);

    if (
      response.data &&
      response.data.success &&
      response.data.data !== undefined
    ) {
      return response.data.data;
    }

    return response.data;
  },
  (error) => {
    console.error(
      `API Request Error for ${error.config?.url || "unknown endpoint"}:`,
      error
    );
    return Promise.reject(error);
  }
);

export const makeRequest = async (endpoint, options = {}) => {
  try {
    const apiPath = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;

    console.log("Fetching:", `${API_BASE_URL}${apiPath}`);

    const axiosOptions = {
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers || {},
      params: options.params || {},
    };

    const response = await api(apiPath, axiosOptions);
    return response;
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
};

export default api;
