import type {paths} from "@/shared/api/schema.ts";
import createClient, {type Middleware} from "openapi-fetch";
import {AUTH_KEYS} from "@/shared/config/constants.ts";

export const client = createClient<paths>({ baseUrl: import.meta.env.VITE_BASE_URL });

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }

    request.headers.set('API-KEY', import.meta.env.VITE_API_KEY)
    return request;
  },
};

client.use(authMiddleware);