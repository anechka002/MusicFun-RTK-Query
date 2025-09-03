import { useDeletePlaylistCoverMutation, useRemovePlaylistMutation, useUploadPlaylistCoverMutation } from '../../api/playlistsApi';
import type { PlaylistData } from '../../api/playlistsApi.types';
import defaultCover from '../../../../assets/images/image.png'
import type { ChangeEvent } from 'react';
import s from './PlaylistItem.module.css'

type Props = {
  playlist: PlaylistData;
  editPlaylist: (playlist: PlaylistData) => void
};

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {

  const [removePlaylist] = useRemovePlaylistMutation();
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = playlist.attributes.images.main.find(img => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  const removePlaylistHandler = () => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      removePlaylist(playlist.id);
    }
  };

  const uploadCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = e.target.files?.length && e.target.files[0]
    if(!file) return 
    console.log(file)

    if(!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG or GIF images are allowed')
      return
    }

    if(file.size > maxSize) {
      alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({playlistId: playlist.id, file})
  }

  const deleteCoverHandler = () => {
    if (confirm('Are you sure you want to delete the Cover?')) {
      deletePlaylistCover({playlistId: playlist.id});
    }
  }
  
  return (
    <div>
      <img className={s.cover} src={src} width={'240px'} alt="cover" />
      <input type="file" accept={'image/jpeg, image/png, image/gif'} onChange={uploadCoverHandler}/>
      {originalCover && <button onClick={deleteCoverHandler}>delete Cover</button>}
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={removePlaylistHandler}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  );
};
