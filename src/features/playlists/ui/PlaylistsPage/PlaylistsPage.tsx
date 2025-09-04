import {type ChangeEvent, useState} from 'react';
import {
  useFetchPlaylistsQuery,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import { useForm } from 'react-hook-form';
import type {
  PlaylistData,
  UpdatePlaylistArgs,
} from '../../api/playlistsApi.types';
import { PlaylistItem } from '../PlaylistItem/PlaylistItem';
import { EditPlaylistForm } from '../EditPlaylistForm/EditPlaylistForm';
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";


export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const debounceSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  const [playlistId, setPlaylistId] = useState<string | null>(null);
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

  const changePageSizeHandler = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1)
    setSearch(e.currentTarget.value)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input
        type="search"
        placeholder={'Search playlist by title'}
        onChange={searchPlaylistHandler}
      />
      <div className={s.items}>
        {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
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
                  editPlaylist={editPlaylistHandler}
                />
              )}
            </div>
          );
        })}
      </div>
      <Pagination pageSize={pageSize} changePageSize={changePageSizeHandler} currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={data?.meta.pagesCount || 1} />
    </div>
  );
};
