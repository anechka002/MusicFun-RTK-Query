import {useForm, type SubmitHandler} from "react-hook-form"
import { useCreatePlaylistMutation } from '@/entities/playlist/api/playlistsApi'
import s from './CreatePlaylistForm.module.css'
import { handleErrors } from '@/shared/lib/utils/handleErrors'
import {
  mapCreatePlaylistPayload
} from "@/features/create-playlist/model/mappers/mapCreatePlaylistPayload.ts";
import type {
  CreatePlaylistFormValues
} from "@/features/create-playlist/model/types.ts";

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistFormValues>({})

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistFormValues> = data => {
    const payload = mapCreatePlaylistPayload(data)

    createPlaylist(payload)
      .unwrap()
      .then(() => {
        reset()
      })
      .catch(handleErrors)
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
      {errors.description && <span className={s.errorMessage}>{errors.description.message}</span>}
      <button type={'submit'}>create playlist</button>
    </form>
  )
}
