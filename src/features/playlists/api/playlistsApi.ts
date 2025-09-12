import { baseApi } from '@/app/api/baseApi'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs
} from './playlistsApi.types'
import type { Images } from '@/common/types';

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({url: `playlists`, params}),
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<{data: PlaylistData}, CreatePlaylistArgs>({
      query: (body) => ({
          method: 'post',
          url: `playlists`,
          body
      }),
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
    uploadPlaylistCover: build.mutation<Images, {playlistId: string; file: File}>({
      query: ({playlistId, file}) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          method: 'post',
          url: `playlists/${playlistId}/images/main`,
          body: formData
        }
      },
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