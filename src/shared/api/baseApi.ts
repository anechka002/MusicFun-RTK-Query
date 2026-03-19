import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: fakeBaseQuery(),
  endpoints: () => ({}),
  // Zod добавляет в проект десятки килобайт к бандлу, в production zod можно отключить
  // skipSchemaValidation: process.env.NODE_ENV === 'production',
})

// console.log(process.env.NODE_ENV)


// baseQuery: baseQueryWithReauth,