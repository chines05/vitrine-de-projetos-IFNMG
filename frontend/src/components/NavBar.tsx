import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { ScrollText, LogIn, Home, School, Menu, X } from 'lucide-react'
import type { User } from '@/utils/types'

type Props = {
  user?: User
}

const Navbar = ({ user }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = () => {
    if (user) {
      navigate('/dashboard')

      return
    }

    navigate('/login')
  }

  const handleScrollToProjetos = () => {
    if (location.pathname.startsWith('/projeto/')) {
      navigate('/')
      setTimeout(() => {
        const target = document.getElementById('projetos')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      setMobileMenuOpen(false)

      return
    }

    const target = document.getElementById('projetos')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const handleLogo = () => {
    if (location.pathname.startsWith('/projeto/')) {
      navigate('/')
      setTimeout(() => {
        const target = document.getElementById('home')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      setMobileMenuOpen(false)
      return
    }

    const target = document.getElementById('home')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="w-full bg-gradient-to-r from-[#2f9e41] to-[#1BA863] text-white shadow-lg fixed top-0 z-40 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={handleLogo}
            >
              <School className="h-6 w-6 transition-transform group-hover:scale-110" />
              <h1 className="text-xl font-bold tracking-tight group-hover:text-white/90 transition-colors">
                Vitrine <span className="hidden sm:inline">de Projetos</span>{' '}
                <span className="font-normal hidden sm:inline">| IFNMG</span>
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="unstyled"
              onClick={handleLogo}
              className="text-white hover:bg-white/10 gap-2 px-3 py-2 rounded-md transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Início</span>
            </Button>

            <Button
              variant="unstyled"
              onClick={handleScrollToProjetos}
              className="text-white hover:bg-white/10 gap-2 px-3 py-2 rounded-md transition-all"
            >
              <ScrollText className="h-4 w-4" />
              <span>Projetos</span>
            </Button>
            <Button
              variant="unstyled"
              onClick={() => navigate('/tcc')}
              className="text-white hover:bg-white/10 gap-2 px-3 py-2 rounded-md transition-all"
            >
              <ScrollText className="h-4 w-4" />
              <span>TCC</span>
            </Button>

            <Button
              onClick={handleLogin}
              className="bg-white text-[#2f9e41] hover:bg-gray-50 gap-2 px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>{user ? 'Dashboard' : 'Login'}</span>
            </Button>
          </nav>
          {mobileMenuOpen ? (
            <X
              className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size={40}
            />
          ) : (
            <Menu
              className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size={40}
            />
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </header>

      <div
        className={`fixed inset-y-0 right-0 w-64 bg-gradient-to-b from-[#2f9e41] to-[#1BA863] shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <X
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              size={40}
              aria-label="Fechar menu"
            />
          </div>

          <nav className="flex flex-col gap-4 flex-grow">
            <Button
              variant="ghost"
              onClick={() => {
                navigate('/')
                setMobileMenuOpen(false)
              }}
              className="w-full justify-start text-white  gap-4 px-4 py-3 rounded-md transition-all text-2xl font-bold"
            >
              <Home size={37} />
              Início
            </Button>

            <Button
              variant="ghost"
              onClick={handleScrollToProjetos}
              className="w-full justify-start text-white  gap-4 px-4 py-3 rounded-md transition-all text-2xl font-bold"
            >
              <ScrollText size={37} />
              Projetos
            </Button>

            <div className="mt-auto">
              <Button
                onClick={handleLogin}
                className="w-full bg-white text-[#2f9e41] hover:bg-gray-50 gap-4 px-4 py-3 rounded-full transition-all shadow-md hover:shadow-lg text-lg"
              >
                <LogIn className="h-5 w-5" />
                {user ? 'Dashboard' : 'Login'}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
