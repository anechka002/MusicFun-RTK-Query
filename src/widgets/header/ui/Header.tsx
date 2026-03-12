import {Link, NavLink} from 'react-router'
import s from './Header.module.css'
import { useGetMeQuery, useLogoutMutation } from '@/entities/session/api/authApi'
import { Login } from '@/features/login/ui/Login'
import { Path } from '@/shared/config/routes'

const navItems = [
  { to: Path.Main, label: 'Main' },
  { to: Path.Playlists, label: 'Playlists' },
  { to: Path.Tracks, label: 'Tracks' },
]

export const Header = () => {
  const {data} = useGetMeQuery(undefined)
  const [logout] = useLogoutMutation()

  const logoutHandler = () => {
    logout()
  }

  return (
    <header className={s.container}>
      <nav>
        <ul className={s.list}>
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `link ${isActive ? s.activeLink : ''}`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {data && (
        <div className={s.loginContainer}>
          <Link to={Path.Profile}>{data.login}</Link>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
      {!data && <Login/>}
    </header>
  )
}
