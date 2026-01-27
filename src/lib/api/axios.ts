/**
 * Single Axios instance for all API calls.
 * Centralises baseURL, auth headers, and token refresh logic.
 */

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8095'
const STORAGE_KEY = 'slotly_session_token'

// ── In-memory token cache ───────────────────────────────

let memoryToken: string | null = null

const persist = (token: string): void => {
  memoryToken = token
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, token)
    }
  } catch {
    // localStorage unavailable (SSR, private mode, quota)
  }
}

const restore = (): string | null => {
  if (memoryToken) return memoryToken
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        memoryToken = stored
        return stored
      }
    }
  } catch {
    // ignore
  }
  return null
}

const clearToken = (): void => {
  memoryToken = null
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

// ── Axios instance ──────────────────────────────────────

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Token fetch (no interceptor to avoid loops) ─────────

interface SessionPayload {
  token: string
}

const fetchNewToken = async (): Promise<string> => {
  const { data } = await axios.post<SessionPayload>(
    `${API_BASE}/public/session`,
  )
  persist(data.token)
  return data.token
}

// ── Request interceptor: inject Bearer token ────────────

const attachToken = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  let token = restore()
  if (!token) {
    token = await fetchNewToken()
  }
  config.headers.Authorization = `Bearer ${token}`
  return config
}

api.interceptors.request.use(attachToken)

// ── Response interceptor: auto-refresh on 401 ──────────

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>()

const onTokenRefreshed = (newToken: string): void => {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

const addRefreshSubscriber = (cb: (token: string) => void): void => {
  refreshSubscribers.push(cb)
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // Prevent infinite retry: only retry once
    if (retriedRequests.has(originalRequest)) {
      return Promise.reject(error)
    }
    retriedRequests.add(originalRequest)

    if (!isRefreshing) {
      isRefreshing = true
      try {
        clearToken()
        const newToken = await fetchNewToken()
        isRefreshing = false
        onTokenRefreshed(newToken)
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []
        return Promise.reject(refreshError)
      }
    }

    return new Promise((resolve) => {
      addRefreshSubscriber((token: string) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(api(originalRequest))
      })
    })
  },
)

// ── Public helpers ──────────────────────────────────────

/** Initialise a session. Call once on mount. */
export const initSession = async (): Promise<string> => {
  const existing = restore()
  if (existing) return existing
  return fetchNewToken()
}

/** Force-refresh the token (e.g. after a 401). */
export const forceRefreshToken = async (): Promise<string> => {
  clearToken()
  return fetchNewToken()
}

export default api
