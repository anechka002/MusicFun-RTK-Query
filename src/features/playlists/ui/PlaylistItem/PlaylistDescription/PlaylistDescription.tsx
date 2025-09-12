import type { PlaylistAttributes } from "@/features/playlists/api/playlistsApi.types"
import s from './PlaylistDescription.module.css'

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({attributes}: Props) => {
  return (
    <>
    <div className={s.title}>title: {attributes.title}</div>
      <div>description: {attributes.description}</div>
      <div>userName: {attributes.user.name}</div>
    </>
  )
}
