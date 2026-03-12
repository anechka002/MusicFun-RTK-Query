import { useGetMeQuery } from '@/entities/session/api/authApi'
import { useFetchPlaylistsQuery } from '@/entities/playlist/api/playlistsApi'
import { CreatePlaylistForm } from '@/features/create-playlist/ui/CreatePlaylistForm'
import { Path } from '@/shared/config/routes'
import { PlaylistSkeleton } from '@/widgets/playlist-skeleton/ui/PlaylistSkeleton'
import { PlaylistsList } from '@/widgets/playlists-list/ui/PlaylistsList'
import s from './ProfilePage.module.css'
import {Navigate} from "react-router";

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery(undefined)
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
