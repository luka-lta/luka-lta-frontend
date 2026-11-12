import {createRoot} from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import '@/i18n/i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App/>
)
