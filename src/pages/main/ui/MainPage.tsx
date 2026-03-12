import { useGetMeQuery } from '@/entities/session/api/authApi'

export const MainPage = () => {
  const { data } = useGetMeQuery(undefined)

  return (
    <div>
      <h1>Main Page</h1>
      <div>login: {data?.login}</div>
    </div>

  )
}
