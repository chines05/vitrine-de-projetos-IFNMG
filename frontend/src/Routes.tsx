import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projeto from './pages/Projeto'
import Tcc from './pages/Tcc'
import TccId from './pages/TccId'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:url" element={<Projeto />} />
        <Route path="/tcc" element={<Tcc />} />
        <Route path="/tcc/:id" element={<TccId />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
