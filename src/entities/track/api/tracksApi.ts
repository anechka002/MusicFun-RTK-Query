import { baseApi } from '@/shared/api/baseApi'
import {client} from "@/shared/api/client.ts";
import type {SchemaGetTrackListOutput,} from "@/shared/api/schema.ts";
import type {FetchTracksQuery} from "@/entities/track/api/tracksApi.types.ts";
import {toFetchError} from "@/shared/lib/utils/handleErrors.ts";

export const tracksApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchTracks: build.infiniteQuery<SchemaGetTrackListOutput, void, string | undefined>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: lastPage => {
          return lastPage.meta.nextCursor || undefined
        },
      },
      async queryFn({ pageParam }) {
        try {
          const query: FetchTracksQuery = {
            cursor: pageParam,
            pageSize: 5,
            paginationType: 'cursor',
          }

          const result = await client.GET('/playlists/tracks', {
            params: {
              query,
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
    }),
  }),
})

export const {useFetchTracksInfiniteQuery} = tracksApi
