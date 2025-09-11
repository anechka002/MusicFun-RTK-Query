import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {toast} from "react-toastify";
import {isErrorWithError, isErrorWithMessage} from "@/common/utils";

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist'],
  baseQuery: async (args, api, extraOptions) => {
    // await new Promise(resolve => setTimeout(resolve, 2000))

    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      prepareHeaders: (headers) => {
        headers.set('API-KEY', import.meta.env.VITE_API_KEY,)
        headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)

    if(result.error) {
      switch (result.error.status) {
        case 404:
          if(isErrorWithError(result.error.data)) {
            toast(result.error.data.error, { type: 'error', theme: 'colored' })
          } else {
            toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          }
          break

        case 429: // API KEY
          // ✅ 1. Type Assertions
          // toast((result.error.data as { message: string }).message, { type: 'error', theme: 'colored' })
          // ✅ 2. JSON.stringify
          // toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          // ✅ 3. Type Predicate
          if (isErrorWithMessage(result.error.data)) {
            toast(result.error.data.message, { type: 'error', theme: 'colored' })
          } else {
            toast(JSON.stringify(result.error.data), { type: 'error', theme: 'colored' })
          }
          break

        default:
          toast('Some error occurred', { type: 'error', theme: 'colored' })
      }
    }

    return result
  },
  endpoints: () => ({}),
})