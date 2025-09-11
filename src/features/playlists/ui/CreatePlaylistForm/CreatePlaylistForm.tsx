import { useForm, type SubmitHandler } from "react-hook-form"
import type { CreatePlaylistArgs } from "../../api/playlistsApi.types"
import { useCreatePlaylistMutation } from "../../api/playlistsApi"

type Props = {
  onPlaylistCreated: () => void
}

export const CreatePlaylistForm = ({onPlaylistCreated}: Props) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = data => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        reset()
        onPlaylistCreated()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button>create playlist</button>
    </form>
  )
}