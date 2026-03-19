import { useGetPlaylistQuery, useRemovePlaylistMutation } from '@/entities/playlist/api/playlistsApi'
import type { PlaylistListItemData } from '@/entities/playlist/api/playlistsApi.types'
import { PlaylistCover } from './PlaylistCover/PlaylistCover';
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription';

type Props = {
  playlist: PlaylistListItemData;
  editPlaylist: (playlistId: string) => void
};

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {

  const [removePlaylist] = useRemovePlaylistMutation();
  const { data: playlistResponse } = useGetPlaylistQuery(playlist.id)

  const removePlaylistHandler = () => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlist.id);
    }
  };

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images}/>
      {playlistResponse ? (
        <PlaylistDescription attributes={playlistResponse.data.attributes}/>
      ) : (
        <div>Loading description...</div>
      )}
      <button onClick={removePlaylistHandler}>delete</button>
      <button onClick={() => editPlaylist(playlist.id)}>update</button>
    </div>
  );
};
