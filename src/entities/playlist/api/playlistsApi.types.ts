import type {
  paths,
  SchemaPlaylistAttributes,
  SchemaPlaylistListItemAttributes,
  SchemaPlaylistListItemResource,
  SchemaPlaylistResource,
  SchemaUpdatePlaylistRequestPayload
} from "@/shared/api/schema.ts";

export type FetchPlaylistsArgs = paths['/playlists']['get']['parameters']['query']

export type UpdatePlaylistBody = SchemaUpdatePlaylistRequestPayload

export type UpdatePlaylistFormValues =
  SchemaUpdatePlaylistRequestPayload['data']['attributes']

export type UpdatePlaylistMutationArg = {
  playlistId: string
  body: UpdatePlaylistBody
}

export type UploadPlaylistCoverArg = {
  playlistId: string
  file: File
}
export type UploadPlaylistCoverBody =
  paths['/playlists/{playlistId}/images/main']['post']['requestBody']['content']['multipart/form-data']

export type DeletePlaylistCoverArg = {
  playlistId: string
}

export type PlaylistData = SchemaPlaylistResource
export type PlaylistListItemData = SchemaPlaylistListItemResource
export type PlaylistAttributes = SchemaPlaylistAttributes
export type PlaylistListItemAttributes = SchemaPlaylistListItemAttributes
// WebSocket Events
export type PlaylistCreatedEvent = {
  type: 'tracks.playlist-created'
  payload: {
    data: PlaylistData
  }
}

export type PlaylistUpdatedEvent = {
  type: 'tracks.playlist-updated'
  payload: {
    data: PlaylistData
  }
}
