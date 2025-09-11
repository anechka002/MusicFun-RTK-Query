import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist'],
  baseQuery: async (args, api, extraOptions) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    return fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set('API-KEY', import.meta.env.VITE_API_KEY,)
        headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)
  },
  endpoints: () => ({}),
})