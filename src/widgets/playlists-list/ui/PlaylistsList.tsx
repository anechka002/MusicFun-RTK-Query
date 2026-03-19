import s from "./PlaylistsList.module.css";
import { EditPlaylistForm } from '@/features/edit-playlist/ui/EditPlaylistForm'
import { useLazyGetPlaylistQuery } from '@/entities/playlist/api/playlistsApi'
import type {
  PlaylistData,
  PlaylistListItemData,
  UpdatePlaylistFormValues
} from '@/entities/playlist/api/playlistsApi.types'
import {useState} from "react";
import {useForm} from "react-hook-form";
import { PlaylistItem } from './PlaylistItem/PlaylistItem'

type Props = {
  playlists: PlaylistListItemData[]
  isPlaylistsLoading: boolean
}

export const PlaylistsList = ({playlists, isPlaylistsLoading}: Props) => {

  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistFormValues>();
  const [getPlaylist] = useLazyGetPlaylistQuery()

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

  const startEditPlaylistHandler = async (playlistId: string) => {
    try {
      setLoadingPlaylistId(playlistId)
      const response = await getPlaylist(playlistId).unwrap()
      editPlaylistHandler(response.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingPlaylistId(null)
    }
  }

  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId;
        const isLoadingEdit = playlist.id === loadingPlaylistId

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
            ) : isLoadingEdit ? (
              <div>Loading playlist...</div>
            ) : (
              <PlaylistItem
                playlist={playlist}
                editPlaylist={startEditPlaylistHandler}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
