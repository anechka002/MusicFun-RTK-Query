import type { paths, SchemaTrackListItemResource } from "@/shared/api/schema.ts";

export type FetchTracksQuery = paths['/playlists/tracks']['get']['parameters']['query']
export type TrackData = SchemaTrackListItemResource
