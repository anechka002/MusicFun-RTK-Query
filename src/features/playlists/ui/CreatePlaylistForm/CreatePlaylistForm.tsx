import {useForm, type SubmitHandler} from "react-hook-form"
import type {CreatePlaylistArgs} from "../../api/playlistsApi.types"
import {useCreatePlaylistMutation} from "../../api/playlistsApi"
import s from './CreatePlaylistForm.module.css'

type Props = {
  onPlaylistCreated: () => void
}

export const CreatePlaylistForm = ({onPlaylistCreated}: Props) => {
  const {register, handleSubmit, reset, formState: { errors },} = useForm<CreatePlaylistArgs>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = data => {
    createPlaylist(data)
      .unwrap()
      .then(() => {
        onPlaylistCreated()
      })
      .catch(error => {
        console.log('Ошибка при создании плейлиста:', error)
      })
      .finally(() => {
        reset() // 🧹 очищаем поля всегда
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title', {
          required: 'Title is required',
          maxLength: {
            value: 100,
            message: 'Title cannot be longer than 100 characters'
          }
        })}
          placeholder={'title'}
        />
      </div>
        {errors.title && <span className={s.errorMessage}>{errors.title.message}</span>}
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button>create playlist</button>
    </form>
  )
}