import type {paths} from "@/shared/api/schema.ts";
import createClient, {type Middleware} from "openapi-fetch";
import {AUTH_KEYS} from "@/shared/config/constants.ts";
import { Mutex } from 'async-mutex'
import { isTokens } from '@/shared/lib/utils'
import { handleUnauthorizedSession } from '@/shared/api/session'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

if (!BASE_URL) {
  throw new Error('VITE_BASE_URL is not defined')
}

if (!API_KEY) {
  throw new Error('VITE_API_KEY is not defined')
}

const mutex = new Mutex()

const REFRESH_PATH = '/auth/refresh'
const RETRY_HEADER = 'x-retry-after-refresh'

export const client = createClient<paths>({ baseUrl: BASE_URL});

const clearTokens = () => {
  localStorage.removeItem(AUTH_KEYS.accessToken)
  localStorage.removeItem(AUTH_KEYS.refreshToken)
}

const clearSession = () => {
  clearTokens()
  handleUnauthorizedSession()
}

const refreshTokens = async (baseUrl: string, fetchFn: typeof fetch) => {
  const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

  if (!refreshToken) {
    clearSession()
    return null
  }

  const refreshRequest = new Request(`${baseUrl}${REFRESH_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-KEY': import.meta.env.VITE_API_KEY,
      [RETRY_HEADER]: 'skip',
    },
    body: JSON.stringify({ refreshToken }),
  })

  const refreshResponse = await fetchFn(refreshRequest)

  if (!refreshResponse.ok) {
    clearSession()
    return null
  }

  const tokens: unknown = await refreshResponse.json()

  if (!isTokens(tokens)) {
    clearSession()
    return null
  }

  localStorage.setItem(AUTH_KEYS.accessToken, tokens.accessToken)
  localStorage.setItem(AUTH_KEYS.refreshToken, tokens.refreshToken)

  return tokens
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    request.headers.set('API-KEY', import.meta.env.VITE_API_KEY)
    return request;
  },
  async onResponse({ request, response, options }) {
    const isRefreshRequest = request.url.includes(REFRESH_PATH)
    const isRetriedRequest = request.headers.get(RETRY_HEADER) === 'true'
    const hasAuthHeader = Boolean(request.headers.get('Authorization'))

    if (response.status !== 401 || isRefreshRequest || isRetriedRequest || !hasAuthHeader) {
      return response
    }

    await mutex.waitForUnlock()

    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const tokens = await refreshTokens(options.baseUrl, options.fetch)

        if (!tokens) {
          return response
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
    }

    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)

    if (!accessToken) {
      return response
    }

    const retryRequest = new Request(request)
    retryRequest.headers.set('Authorization', `Bearer ${accessToken}`)
    retryRequest.headers.set(RETRY_HEADER, 'true')

    return options.fetch(retryRequest)
  },
};

client.use(authMiddleware);
