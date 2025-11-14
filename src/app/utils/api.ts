// src/app/utils/api.ts
import axios, { AxiosRequestConfig } from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

export type ApiResponse<T> = {
  // for /auth/login and /auth/signup: { user, token }
  // for /auth/me: user object (T)
  // for items lists: custom objects
  data?: T;
  token?: string;
  user?: any;
  items?: any;
  total?: number;
  pages?: number;
  page?: number;
  message?: string;
};

function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getRequest<T = any>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<{ data: T; status: number }> {
  const res = await api.get(url, config);
  return { data: res.data as T, status: res.status };
}

export async function postRequest<T = any, B = any>(
  url: string,
  body?: B,
  config: AxiosRequestConfig = {}
): Promise<{ data: T; status: number }> {
  const res = await api.post(url, body, config);
  return { data: res.data as T, status: res.status };
}

export async function putRequest<T = any, B = any>(
  url: string,
  body?: B,
  config: AxiosRequestConfig = {}
): Promise<{ data: T; status: number }> {
  const res = await api.put(url, body, config);
  return { data: res.data as T, status: res.status };
}

export async function deleteRequest<T = any>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<{ data: T; status: number }> {
  const res = await api.delete(url, config);
  return { data: res.data as T, status: res.status };
}

// small helper for including token automatically on client side
export function clientAuthConfig() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return { headers: authHeaders(token || undefined) };
}