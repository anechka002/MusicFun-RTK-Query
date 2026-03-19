import { useUpdatePlaylistMutation } from '@/entities/playlist/api/playlistsApi';
import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form';
import type {
  UpdatePlaylistFormValues
} from "@/entities/playlist/api/playlistsApi.types.ts";

type Props = {
  playlistId: string
  register: UseFormRegister<UpdatePlaylistFormValues>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistFormValues>
  editPlaylist: (playlist: null) => void
  setPlaylistId: (playlistId: null) => void
}

export const EditPlaylistForm = ({playlistId, register, handleSubmit, editPlaylist, setPlaylistId}: Props) => {

  const [updatePlaylist] = useUpdatePlaylistMutation();

  const onSubmit: SubmitHandler<UpdatePlaylistFormValues> = async (data) => {
    if (!playlistId) return;
    try {
      await updatePlaylist({
        playlistId,
        body: {
          data: {
            type: 'playlists',
            attributes: data,
          }
        }
      }).unwrap()

      setPlaylistId(null)
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  );
};
