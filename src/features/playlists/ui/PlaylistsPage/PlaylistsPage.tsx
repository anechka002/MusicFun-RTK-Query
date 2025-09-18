import {type ChangeEvent, useState} from 'react';
import {
  useFetchPlaylistsQuery,
} from '../../api/playlistsApi';
import s from './PlaylistsPage.module.css';
import {useDebounceValue} from "@/common/hooks";
import {
  PlaylistsList
} from "@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx";
import { Pagination } from "@/common/components";
import {
  PlaylistSkeleton
} from "@/features/playlists/ui/PlaylistSkeleton/PlaylistSkeleton.tsx";

export const PlaylistsPage = () => {
  const [search, setSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const debounceSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageNumber: currentPage,
    pageSize,
  });

  const skeletons = [...new Array(8)].map((_, i) => <PlaylistSkeleton key={i} />);

  const changePageSizeHandler = (pageSize: number) => {
    setPageSize(pageSize);
    setCurrentPage(1)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1)
    setSearch(e.currentTarget.value)
  }

  if(isLoading) return skeletons;

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
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
