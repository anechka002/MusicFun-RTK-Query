import { useGetMeQuery } from '@/entities/session/api/authApi'
import { AUTH_KEYS } from '@/shared/config/constants'

export const MainPage = () => {
  const hasAccessToken = Boolean(localStorage.getItem(AUTH_KEYS.accessToken))
  const { data } = useGetMeQuery(undefined, { skip: !hasAccessToken })

  return (
    <div>
      <h1>Main Page</h1>
      <div>login: {data?.login}</div>
    </div>

  )
}
