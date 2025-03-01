import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { BaseLayout } from './pages/layouts/BaseLayout'
import './styles/index.css'
import { Home } from './pages/Home'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<BaseLayout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
