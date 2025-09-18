import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {AUTH_KEYS} from "@/common/constans";

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem(AUTH_KEYS.accessToken)
    if(accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    headers.set('API-KEY', import.meta.env.VITE_API_KEY,)
    return headers
  },
})