import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: API_BASE,
});

// 🔥 Automatically attach auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export async function login(email, password) {
  const body = new URLSearchParams({ email, password });

  const { data } = await API.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data; // { access_token, token_type }
}

export async function signup(email, password) {
  const body = new URLSearchParams({ email, password });

  const { data } = await API.post("/auth/signup", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
}