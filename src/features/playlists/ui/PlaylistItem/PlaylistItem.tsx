import { useRemovePlaylistMutation } from '../../api/playlistsApi';
import type { PlaylistData } from '../../api/playlistsApi.types';
import { PlaylistCover } from './PlaylistCover/PlaylistCover';
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription';

type Props = {
  playlist: PlaylistData;
  editPlaylist: (playlist: PlaylistData) => void
};

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {

  const [removePlaylist] = useRemovePlaylistMutation();

  const removePlaylistHandler = () => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlist.id);
    }
  };

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images}/>
      <PlaylistDescription attributes={playlist.attributes}/>
      <button onClick={removePlaylistHandler}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  );
};
