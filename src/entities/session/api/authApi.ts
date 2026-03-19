import { baseApi } from '@/shared/api/baseApi'
import { AUTH_KEYS } from '@/shared/config/constants'
import {client} from "@/shared/api/client.ts";
import type {
  SchemaGetMeOutput,
  SchemaLoginRequestPayload, SchemaRefreshOutput
} from "@/shared/api/schema.ts";
import {toFetchError} from "@/shared/lib/utils/handleErrors.ts";

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<SchemaGetMeOutput, void>({
      async queryFn() {
        try {
          const result = await client.GET('/auth/me')

          if (!result.data) {
            return { error: toFetchError('No data received') }
          }

          return { data: result.data }
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },
      providesTags: ['Auth'],
    }),
    login: build.mutation<SchemaRefreshOutput, SchemaLoginRequestPayload>({
      async queryFn(payload) {
        try {
          const result = await client.POST('/auth/login', {
            body: {
              ...payload,
              accessTokenTTL: '15m',
            },
          })

          if (!result.data) {
            return { error: toFetchError('No data received') }
          }

          return { data: result.data }
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },
      onQueryStarted: async(_args, {dispatch, queryFulfilled})  => {
        const {data} = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)

        // Invalidate after saving tokens
        dispatch(authApi.util.invalidateTags(['Auth']))
      },
    }),
    logout: build.mutation<void, void>({
      async queryFn() {
        try {
          const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

          if (!refreshToken) {
            return { error: toFetchError('No refresh token found') }
          }

          await client.POST('/auth/logout', {
            body: { refreshToken }
          })

          return { data: undefined}
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },
      onQueryStarted: async(_args, {dispatch, queryFulfilled})  => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)

        // Invalidate after saving tokens
        dispatch(baseApi.util.resetApiState())
      }
    }),
  })
})

export const {useGetMeQuery, useLoginMutation, useLogoutMutation} = authApi
