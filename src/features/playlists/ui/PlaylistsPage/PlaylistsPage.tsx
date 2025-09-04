import {type ChangeEvent, useState} from 'react';
import {
  useFetchPlaylistsQuery,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm';
import s from './PlaylistsPage.module.css';
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";
import {
  PlaylistsList
} from "@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx";


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

  if (isLoading) return <p>Loading...</p>;

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
      <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading}/>
      <Pagination pageSize={pageSize} changePageSize={changePageSizeHandler} currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={data?.meta.pagesCount || 1} />
    </div>
  );
};
