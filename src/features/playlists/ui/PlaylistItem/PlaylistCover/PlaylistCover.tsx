import type { ChangeEvent } from 'react';
import s from './PlaylistCover.module.css';
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi';
import defaultCover from '@/assets/images/image.png'
import type { Images } from '@/common/types';
import {errorToast} from "@/common/utils";

type Props = {
  playlistId: string;
  images: Images
};

export const PlaylistCover = ({playlistId, images}: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation();
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation();

  const originalCover = images.main.find(img => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024; // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const file = e.target.files?.length && e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG or GIF images are allowed');
      return;
    }

    if (file.size > maxSize) {
      errorToast(
        `The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`);
      return;
    }

    uploadPlaylistCover({ playlistId: playlistId, file });
  };

  const deleteCoverHandler = () => {
    if (confirm('Are you sure you want to delete the Cover?')) {
      deletePlaylistCover({ playlistId: playlistId });
    }
  };

  return (
    <>
      <img className={s.cover} src={src} width={'240px'} alt="cover" />
      <input
        type="file"
        accept={'image/jpeg, image/png, image/gif'}
        onChange={uploadCoverHandler}
      />
      {originalCover && (
        <button onClick={deleteCoverHandler}>delete Cover</button>
      )}
    </>
  );
};
