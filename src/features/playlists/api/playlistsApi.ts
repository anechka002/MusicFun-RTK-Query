import { baseApi } from '@/app/api/baseApi'
import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from './playlistsApi.types'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => `playlists`,
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
      query: ({playlistId, body}) => ({
          method: 'put',
          url: `playlists/${playlistId}`,
          body
      }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useRemovePlaylistMutation, useUpdatePlaylistMutation } = playlistsApi