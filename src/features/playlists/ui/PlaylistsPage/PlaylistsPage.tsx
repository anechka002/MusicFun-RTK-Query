import {type ChangeEvent, useState} from 'react';
import {
  useFetchPlaylistsQuery,
} from '../../api/playlistsApi';
import { CreatePlaylistForm } from '../CreatePlaylistForm/CreatePlaylistForm';
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

  // if(error) {
  //   if('status' in error) {
  //     // FetchBaseQueryError
  //     const errMsg = 'error' in error ? error.error : (error.data as { error: string }).error
  //     toast(errMsg, { type: 'error', theme: 'colored' })
  //   } else {
  //     // SerializedError
  //     toast(error.message || 'Some error occurred', { type: 'error', theme: 'colored' })
  //   }
  //   // toast(error.data.error, {type: "error", theme: 'colored'});
  // }

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
      <CreatePlaylistForm onPlaylistCreated={() => setCurrentPage(1)}/>
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
