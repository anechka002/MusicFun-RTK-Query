import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/ui/App.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
