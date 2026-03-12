import { baseApi } from '@/shared/api/baseApi'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs, PlaylistCreatedEvent,
  PlaylistUpdatedEvent, UpdatePlaylistArgs
} from './playlistsApi.types'
import {
  playlistCreateResponseSchema,
  playlistsResponseSchema
} from '@/entities/playlist/model/playlists.schemas'
import { imagesSchema } from '@/shared/api/schemas'
import { SOCKET_EVENTS } from '@/shared/config/constants'
import { subscribeToEvents } from '@/shared/lib/socket'
import { withZodCatch } from '@/shared/lib/utils'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({url: `playlists`, params}),
      ...withZodCatch(playlistsResponseSchema),
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
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
          method: 'post',
          url: `playlists`,
          body
      }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlist'],
    }),
    removePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
          method: 'delete',
          url: `playlists/${playlistId}`,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, {playlistId: string; body: UpdatePlaylistArgs}>({
      query: ({playlistId, body}) => {
        console.log('4')
        return {
          method: 'put',
          url: `playlists/${playlistId}`,
          body
        }
      },
      
      onQueryStarted: async ({ playlistId, body }, { dispatch, queryFulfilled, getState }) => {
        console.log('1')

        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults: any[] = []
        // debugger

        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                // название эндпоинта, в котором нужно обновить кэш
                'fetchPlaylists',
                // аргументы для эндпоинта
                { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
                // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
                state => {
                  console.log('2')
                  const index = state.data.findIndex(playlist => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                }
              )
            )
          )
        })

        try {
          console.log('3')
          await queryFulfilled
          console.log('5 success')
        } catch {
          patchResults.forEach(patchResult => {
            patchResult.undo()
          })
          console.log('5 error')
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation({
      query: ({playlistId, file}: { playlistId: string; file: File }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          method: 'post',
          url: `playlists/${playlistId}/images/main`,
          body: formData
        }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, {playlistId: string}>({
      query: ({playlistId}) => {
        return {
          method: 'delete',
          url: `playlists/${playlistId}/images/main`,
        }
      },
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useRemovePlaylistMutation, useUpdatePlaylistMutation, useUploadPlaylistCoverMutation, useDeletePlaylistCoverMutation } = playlistsApi
