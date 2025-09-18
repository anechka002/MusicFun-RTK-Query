import {useGetMeQuery} from "@/features/auth/api/authApi.ts";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi.ts";
import {
  PlaylistsList
} from "@/features/playlists/ui/PlaylistsList/PlaylistsList.tsx";
import {
  CreatePlaylistForm
} from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx";
import s from './ProfilePage.module.css'
import {
  PlaylistSkeleton
} from "@/features/playlists/ui/PlaylistSkeleton/PlaylistSkeleton.tsx";
import {Navigate} from "react-router";
import {Path} from "@/common/routing";

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery({
    userId: meResponse?.userId,
  }, {skip: !meResponse?.userId});

  const skeletons = [...new Array(4)].map((_, i) => <PlaylistSkeleton key={i} />);

  if (isLoading || isMeLoading) return skeletons

  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />

  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm/>
        <PlaylistsList playlists={playlistsResponse?.data || []} isPlaylistsLoading={isLoading || isMeLoading}/>
      </div>
    </div>
  )
}
