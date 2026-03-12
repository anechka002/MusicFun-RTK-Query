import { baseApi } from '@/shared/api/baseApi'

import type {
  FetchTracksResponse
} from '@/entities/track/api/tracksApi.types'
import {
  fetchTracksResponseSchema
} from '@/entities/track/model/tracks.schemas'
import { withZodCatch } from '@/shared/lib/utils'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: lastPage => {
          return lastPage.meta.nextCursor || undefined
        },
      },
      query: ({pageParam}) => {
        return {
          url: 'playlists/tracks',
          params: {cursor: pageParam, pageSize: 5, paginationType: 'cursor'}
        }
      },
      ...withZodCatch(fetchTracksResponseSchema)
    }),
  }),
})

export const {useFetchTracksInfiniteQuery} = tracksApi
