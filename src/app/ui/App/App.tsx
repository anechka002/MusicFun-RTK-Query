import { useGlobalLoading } from '@/app/hooks/useGlobalLoading'
import { AppRouter } from '@/app/router/router'
import { LinearProgress } from '@/shared/ui'
import { Header } from '@/widgets/header/ui/Header'
import s from './App.module.css'
import { ToastContainer } from "react-toastify"

function App() {
  const isGlobalLoading = useGlobalLoading()

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
