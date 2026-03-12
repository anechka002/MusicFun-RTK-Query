import { MainPage } from '@/pages/main/ui/MainPage'
import { PageNotFound } from '@/pages/not-found/ui/PageNotFound'
import { OAuthCallback } from '@/pages/oauth-callback/ui/OAuthCallback'
import { PlaylistsPage } from '@/pages/playlists/ui/PlaylistsPage'
import { ProfilePage } from '@/pages/profile/ui/ProfilePage'
import { TracksPage } from '@/pages/tracks/ui/TracksPage'
import { Path } from '@/shared/config/routes'
import { Route, Routes } from "react-router"

export const AppRouter = () => (
  <Routes>
    <Route path={Path.Main} element={<MainPage />} />
    <Route path={Path.Playlists} element={<PlaylistsPage />} />
    <Route path={Path.Tracks} element={<TracksPage />} />
    <Route path={Path.Profile} element={<ProfilePage />} />
    <Route path={Path.OAuthRedirect} element={<OAuthCallback />} />
    <Route path={Path.NotFound} element={<PageNotFound />} />
  </Routes>
)
