import { useState } from 'react';
import {
  useFetchPlaylistsQuery,
  useRemovePlaylistMutation,
  useUpdatePlaylistMutation,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from '../../api/playlistsApi.types';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';
import { EditPlaylistForm } from '../EditPlaylistForm/EditPlaylistForm';

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const { data, isLoading } = useFetchPlaylistsQuery();

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  if (isLoading) return <p>Loading...</p>;

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
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
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
                  editPlaylistHandler={editPlaylistHandler}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
