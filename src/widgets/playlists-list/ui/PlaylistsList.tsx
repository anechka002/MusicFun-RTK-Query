import s from "./PlaylistsList.module.css";
import { EditPlaylistForm } from '@/features/edit-playlist/ui/EditPlaylistForm'
import type {
  PlaylistData, UpdatePlaylistArgs
} from '@/entities/playlist/api/playlistsApi.types'
import {useState} from "react";
import {useForm} from "react-hook-form";
import { PlaylistItem } from './PlaylistItem/PlaylistItem'

type Props = {
  playlists: PlaylistData[]
  isPlaylistsLoading: boolean
}

export const PlaylistsList = ({playlists, isPlaylistsLoading}: Props) => {

  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id);
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((t) => t.id),
      });
    } else {
      setPlaylistId(null);
    }
  };

  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId;

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                register={register}
                handleSubmit={handleSubmit}
                setPlaylistId={setPlaylistId}
                editPlaylist={editPlaylistHandler}
              />
            ) : (
              <PlaylistItem
                playlist={playlist}
                editPlaylist={editPlaylistHandler}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
