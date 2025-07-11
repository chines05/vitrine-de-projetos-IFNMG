import { LogOut, Home, BookText, Users, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { School } from 'lucide-react'
import { useState, type JSX } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

import VisaoGeral from '../components/dashboard/VisaoGeral'
import Projetos from '../components/dashboard/Projetos'
import Participantes from '../components/dashboard/Participantes'
import Configuracoes from '../components/dashboard/Configuracoes'

type ComponentKeys =
  | 'visaoGeral'
  | 'projetos'
  | 'participantes'
  | 'configuracoes'

export function DashboardSidebar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeComponent, setActiveComponent] =
    useState<ComponentKeys>('visaoGeral')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const components: Record<ComponentKeys, JSX.Element> = {
    visaoGeral: <VisaoGeral />,
    projetos: <Projetos />,
    participantes: <Participantes />,
    configuracoes: <Configuracoes />,
  }

  return (
    <>
      <div className="hidden lg:flex lg:w-64 h-full bg-gradient-to-b from-[#2f9e41] to-[#1BA863] text-white shadow-xl flex-col fixed z-30">
        <div className="p-4 border-b border-white/20 flex items-center gap-2">
          <School className="h-6 w-6" />
          <h1 className="text-xl font-bold tracking-tight">Painel Admin</h1>
        </div>

        <div className="p-4 border-b border-white/20">
          <p className="text-sm text-white/80">{getGreeting()}</p>
          <p className="font-medium">Chinẽs Porto</p>
          <p className="text-sm text-white/80">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant="unstyled"
            onClick={() => setActiveComponent('visaoGeral')}
            className={`w-full justify-start gap-3 ${
              activeComponent === 'visaoGeral'
                ? 'bg-white/20 hover:bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Visão Geral</span>
          </Button>

          <Button
            variant="unstyled"
            onClick={() => setActiveComponent('projetos')}
            className={`w-full justify-start gap-3 ${
              activeComponent === 'projetos'
                ? 'bg-white/20 hover:bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <BookText className="h-5 w-5" />
            <span>Projetos</span>
          </Button>

          <Button
            variant="unstyled"
            onClick={() => setActiveComponent('participantes')}
            className={`w-full justify-start gap-3 ${
              activeComponent === 'participantes'
                ? 'bg-white/20 hover:bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Participantes</span>
          </Button>

          <Button
            variant="unstyled"
            onClick={() => setActiveComponent('configuracoes')}
            className={`w-full justify-start gap-3 ${
              activeComponent === 'configuracoes'
                ? 'bg-white/20 hover:bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-white/20">
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-white text-[#2f9e41] hover:bg-gray-50 gap-2 px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <div className="lg:ml-64">{components[activeComponent]}</div>

      <button
        className="lg:hidden fixed top-4 left-4 z-40 bg-white/90 text-green-700 p-2 rounded-md shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#2f9e41] to-[#1BA863] text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center p-4 border-b border-white/20">
            <div className="flex items-center gap-2">
              <School className="h-6 w-6" />
              <h1 className="text-xl font-bold">Painel Admin</h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 border-b border-white/20">
            <p className="text-sm text-white/80">{getGreeting()}</p>
            <p className="font-medium">Chinẽs Porto</p>
            <p className="text-sm text-white/80">Admin</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'visaoGeral', icon: Home, label: 'Visão Geral' },
              { id: 'projetos', icon: BookText, label: 'Projetos' },
              { id: 'participantes', icon: Users, label: 'Participantes' },
              { id: 'configuracoes', icon: Settings, label: 'Configurações' },
            ].map((item) => (
              <Button
                key={item.id}
                variant="unstyled"
                onClick={() => {
                  setActiveComponent(item.id as ComponentKeys)
                  setMobileMenuOpen(false)
                }}
                className={`w-full justify-start gap-3 text-xl font-medium ${
                  activeComponent === item.id
                    ? 'bg-white/20 hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/20">
            <Button
              onClick={() => {
                navigate('/login')
                setMobileMenuOpen(false)
              }}
              className="w-full bg-white text-[#2f9e41] hover:bg-gray-50 gap-2 px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="h-6 w-6" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
