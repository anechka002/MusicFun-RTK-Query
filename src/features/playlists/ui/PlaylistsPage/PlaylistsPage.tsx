import { useFetchPlaylistsQuery, useRemovePlaylistMutation } from '../../api/playlistsApi'
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {

  const {data, isLoading} = useFetchPlaylistsQuery()

  const [removePlaylist] = useRemovePlaylistMutation()

  if(isLoading) return <p>Loading...</p>

  const removePlaylistHandler = (playlistId: string) => {
    if(confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlistId)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm/>
      <div className={s.items}>
        {data?.data.map(playlist => {
          return (
            <div className={s.item} key={playlist.id}>
              <div>title: {playlist.attributes.title}</div>
              <div>description: {playlist.attributes.description}</div>
              <div>userName: {playlist.attributes.user.name}</div>
              <button onClick={() => removePlaylistHandler(playlist.id)}>delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
