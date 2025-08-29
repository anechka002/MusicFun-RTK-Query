import { useRemovePlaylistMutation } from '../../api/playlistsApi';
import type { PlaylistData } from '../../api/playlistsApi.types';

type Props = {
  playlist: PlaylistData;
  editPlaylistHandler: (playlist: PlaylistData) => void
};

export const PlaylistItem = ({ playlist, editPlaylistHandler }: Props) => {

  const [removePlaylist] = useRemovePlaylistMutation();

  const removePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlistId);
    }
  };
  
  return (
    <div>
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => removePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  );
};
