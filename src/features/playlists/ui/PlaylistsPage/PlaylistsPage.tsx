import { useState } from 'react';
import {
  useFetchPlaylistsQuery,
  useRemovePlaylistMutation,
  useUpdatePlaylistMutation,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { PlaylistData, UpdatePlaylistArgs } from '../../api/playlistsApi.types';

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  const { data, isLoading } = useFetchPlaylistsQuery();
  const [removePlaylist] = useRemovePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();

  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>();

  if (isLoading) return <p>Loading...</p>;

  const removePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlistId);
    }
  };

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id);
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map(t => t.id)
      })
    } else {
      setPlaylistId(null);
    }
  };

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (data) => {
    if(!playlistId) return 
    updatePlaylist({ playlistId, body: data }).then(() => setPlaylistId(null))
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2>Edit playlist</h2>
                  <div>
                    <input {...register('title')} placeholder={'title'} />
                  </div>
                  <div>
                    <input
                      {...register('description')}
                      placeholder={'description'}
                    />
                  </div>
                  <button type={'submit'}>save</button>
                  <button
                    type={'button'}
                    onClick={() => editPlaylistHandler(null)}
                  >
                    cancel
                  </button>
                </form>
              ) : (
                <div>
                  <div>title: {playlist.attributes.title}</div>
                  <div>description: {playlist.attributes.description}</div>
                  <div>userName: {playlist.attributes.user.name}</div>
                  <button onClick={() => removePlaylistHandler(playlist.id)}>
                    delete
                  </button>
                  <button onClick={() => editPlaylistHandler(playlist)}>
                    update
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
