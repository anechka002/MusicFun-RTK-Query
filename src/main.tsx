import { createRoot } from 'react-dom/client'
import '@/app/styles/index.css'
import App from './app/ui/App/App.tsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './app/providers/store/store.ts'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
