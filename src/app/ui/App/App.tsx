import { useEffect } from 'react'
import { useGlobalLoading } from '@/app/hooks/useGlobalLoading'
import { store } from '@/app/providers/store/store'
import { AppRouter } from '@/app/router/router'
import { baseApi } from '@/shared/api/baseApi'
import { registerUnauthorizedHandler } from '@/shared/api/session'
import { LinearProgress } from '@/shared/ui'
import { Header } from '@/widgets/header/ui/Header'
import s from './App.module.css'
import { ToastContainer } from "react-toastify"

function App() {
  const isGlobalLoading = useGlobalLoading()

  useEffect(() => {
    return registerUnauthorizedHandler(() => {
      store.dispatch(baseApi.util.resetApiState())
    })
  }, [])

  return (
    <>
      <Header/>
      {isGlobalLoading && <LinearProgress/>}
      <div className={s.layout}>
        <AppRouter/>
      </div>
      <ToastContainer/>
    </>
  )
}

export default App
