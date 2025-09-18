import {baseApi} from "@/app/api/baseApi.ts";
import type {LoginArgs} from "@/features/auth/api/authApi.types.ts";
import {AUTH_KEYS} from "@/common/constans";
import {
  loginResponseSchema,
  meResponseSchema
} from "@/features/auth/model/auth.schemas.ts";
import {withZodCatch} from "@/common/utils";

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query({
      query: () => 'auth/me',
      ...withZodCatch(meResponseSchema),
      providesTags: ['Auth'],
    }),
    login: build.mutation({
      query: (payload: LoginArgs)  => ({
        url: 'auth/login',
        method: 'post',
        body: {...payload, accessTokenTTL: '15m'},
      }),
      onQueryStarted: async(_args, {dispatch, queryFulfilled})  => {
        const {data} = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)

        // Invalidate after saving tokens
        dispatch(authApi.util.invalidateTags(['Auth']))
      },
      ...withZodCatch(loginResponseSchema),
    }),
    logout: build.mutation<void, void>({
      query: ()  => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return { url: 'auth/logout', method: 'post', body: {refreshToken}}
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