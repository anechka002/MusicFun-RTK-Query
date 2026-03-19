import { baseApi } from '@/shared/api/baseApi'
import {
  type DeletePlaylistCoverArg,
  type FetchPlaylistsArgs,
  type PlaylistCreatedEvent,
  type PlaylistUpdatedEvent, type UpdatePlaylistMutationArg,
  type UploadPlaylistCoverArg, type UploadPlaylistCoverBody
} from './playlistsApi.types'
import type {
  SchemaGetPlaylistsOutput,
  SchemaGetPlaylistOutput,
  SchemaCreatePlaylistRequestPayload,
  SchemaTrackImages,
} from '@/shared/api/schema'
import { SOCKET_EVENTS } from '@/shared/config/constants'
import { subscribeToEvents } from '@/shared/lib/socket'
import {client} from "@/shared/api/client.ts";
import {toFetchError} from "@/shared/lib/utils/handleErrors.ts";

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchPlaylists: build.query<SchemaGetPlaylistsOutput, FetchPlaylistsArgs>({
      async queryFn(queryArgs) {
        try {
          const result = await client.GET('/playlists', {
            params: {
              query: queryArgs,
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
      keepUnusedDataFor: 0, // 👈 очистка сразу после размонтирования
      onCacheEntryAdded: async(_arg, {cacheDataLoaded, updateCachedData, cacheEntryRemoved}) =>{
        // Ждем разрешения начального запроса перед продолжением
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvents<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg: PlaylistCreatedEvent) => {
            // 1 вариант
            const newPlaylist = msg.payload.data
            updateCachedData(state => {
              state.data.pop()
              state.data.unshift(newPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
            // 2 вариант
            // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
          }),
          subscribeToEvents<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg: PlaylistUpdatedEvent) => {
            // 1 вариант
            const newPlaylist = msg.payload.data
            updateCachedData(state => {
              const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
            // 2 вариант
            // dispatch(playlistsApi.util.invalidateTags(['Playlist']))
          })
        ]

        // CacheEntryRemoved разрешится, когда подписка на кеш больше не активна
        await cacheEntryRemoved
        unsubscribes.forEach(unsubscribe => unsubscribe())
      },
      providesTags: ['Playlist'],
    }),
    getPlaylist: build.query<SchemaGetPlaylistOutput, string>({
      async queryFn(playlistId) {
        try {
          const result = await client.GET('/playlists/{playlistId}', {
            params: {
              path: {
                playlistId,
              },
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
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<SchemaGetPlaylistOutput, SchemaCreatePlaylistRequestPayload>({
      async queryFn(body) {
        try {
          const result = await client.POST('/playlists', {
            body,
          })

          if (!result.data) {
            return {error: toFetchError('No data received')}
          }

          return {data: result.data};
        } catch (error) {
          return {error: toFetchError(error)}
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    removePlaylist: build.mutation<void, string>({
      async queryFn(playlistId) {
        try {
          await client.DELETE(`/playlists/{playlistId}`, {
            params: {
              path: {
                playlistId,
              }
            }
          })

          return {data: undefined};
        } catch (error) {
          return {error: toFetchError(error)}
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, UpdatePlaylistMutationArg>({
      async queryFn({ playlistId, body }) {
        try {
          await client.PUT('/playlists/{playlistId}', {
            params: {
              path: {playlistId},
            },
            body
          })

          return { data: undefined }
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },

      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        const cachedArgs = playlistsApi.util.selectCachedArgsForQuery(
          getState(),
          'fetchPlaylists'
        )

        const patchResults: { undo: () => void }[] = []

        cachedArgs.forEach(arg => {
          const patchResult = dispatch(
            playlistsApi.util.updateQueryData(
              'fetchPlaylists',
              arg,
              state => {
                const playlist = state.data.find(playlist => playlist.id === playlistId)

                if (playlist) {
                  playlist.attributes = {
                    ...playlist.attributes,
                    ...body.data.attributes,
                  }
                }
              }
            )
          )

          patchResults.push(patchResult)
        })

        const playlistPatchResult = dispatch(
          playlistsApi.util.updateQueryData(
            'getPlaylist',
            playlistId,
            state => {
              state.data.attributes = {
                ...state.data.attributes,
                ...body.data.attributes,
              }
            }
          )
        )

        patchResults.push(playlistPatchResult)

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },

      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation<SchemaTrackImages, UploadPlaylistCoverArg>({
      async queryFn({playlistId, file}) {
        try {
          const formData = new FormData()
          formData.append('file', file)

          const result = await client.POST('/playlists/{playlistId}/images/main', {
            params: {
              path: {
                playlistId,
              },
            },
            body: formData as unknown as UploadPlaylistCoverBody,
          })

          if (!result.data) {
            return { error: toFetchError('No data received') }
          }

          return { data: result.data }
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, DeletePlaylistCoverArg>({
      async queryFn({playlistId}) {
        try {
          await client.DELETE('/playlists/{playlistId}/images/main', {
            params: {
              path: {
                playlistId,
              },
            },
          })

          return { data: undefined}
        } catch (error) {
          return { error: toFetchError(error) }
        }
      },
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useGetPlaylistQuery,
  useLazyGetPlaylistQuery,
  useCreatePlaylistMutation,
  useRemovePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation
} = playlistsApi
