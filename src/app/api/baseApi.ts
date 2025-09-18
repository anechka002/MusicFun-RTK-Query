import {createApi} from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth} from "@/app/api/baseQueryWithReauth.ts";

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  // Zod добавляет в проект десятки килобайт к бандлу, в production zod можно отключить
  // skipSchemaValidation: process.env.NODE_ENV === 'production',
})

// console.log(process.env.NODE_ENV)