import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { BaseLayout } from './pages/layouts/BaseLayout'
import './styles/index.css'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<BaseLayout />}>
                {/* localhost:5173/ */}
                <Route index element={<Home />} />
                
                {/* localhost:5173/about */}
                <Route path='about' element={<About />}/>

                {/* localhost:5173/contact */}
                <Route path='contact' element={<Contact />}/>
            </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
