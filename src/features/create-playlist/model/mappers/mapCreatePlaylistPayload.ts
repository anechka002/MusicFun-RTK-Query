import type {
  CreatePlaylistFormValues
} from "@/features/create-playlist/model/types.ts";
import type {SchemaCreatePlaylistRequestPayload} from "@/shared/api/schema.ts";

export const mapCreatePlaylistPayload = (
  values: CreatePlaylistFormValues
): SchemaCreatePlaylistRequestPayload => ({
  data: {
    type: 'playlists',
    attributes: {
      title: values.title,
      description: values.description.trim() ? values.description : null,
    },
  },
})