import { Home, BookText, Users, Settings } from 'lucide-react'
import { School } from 'lucide-react'
import { useState, type JSX } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

import VisaoGeral from './dashboard/VisaoGeral'
import Projetos from './dashboard/Projetos'
import Usuarios from './dashboard/Usuarios'
import Alunos from './dashboard/Alunos'
import type { User } from '@/utils/types'

type ComponentKeys = 'visaoGeral' | 'projetos' | 'alunos' | 'usuarios'

type Props = {
  user: User
}

export function DashboardSidebar({ user }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeComponent, setActiveComponent] =
    useState<ComponentKeys>('visaoGeral')

  const components: Record<ComponentKeys, JSX.Element> = {
    visaoGeral: <VisaoGeral />,
    projetos: <Projetos />,
    alunos: <Alunos />,
    usuarios: <Usuarios />,
  }

  return (
    <>
      <div className="hidden lg:flex lg:w-64 h-full bg-gradient-to-b from-[#2f9e41] to-[#1BA863] text-white flex-col fixed z-30">
        <div className="p-3 pl-4 border-b h-16 border-white/20 flex items-center gap-2">
          <School className="h-6 w-6" />
          <h1 className="text-xl font-bold tracking-tight">Painel Admin</h1>
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
            onClick={() => setActiveComponent('alunos')}
            className={`w-full justify-start gap-3 ${
              activeComponent === 'alunos'
                ? 'bg-white/20 hover:bg-white/20'
                : 'hover:bg-white/10'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Alunos</span>
          </Button>

          {user.role === 'ADMIN' && (
            <Button
              variant="unstyled"
              onClick={() => setActiveComponent('usuarios')}
              className={`w-full justify-start gap-3 ${
                activeComponent === 'usuarios'
                  ? 'bg-white/20 hover:bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Usuários</span>
            </Button>
          )}
        </nav>
      </div>
      <div className="ml-4 lg:ml-70 pt-20 pr-7 w-full">
        {components[activeComponent]}
      </div>
      <Button
        className="lg:hidden fixed top-4 left-4 z-40 bg-white/90 text-green-700 p-2 rounded-md shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
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
            <Button
              onClick={() => setMobileMenuOpen(false)}
              variant="unstyled"
              className="p-2 hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'visaoGeral', icon: Home, label: 'Visão Geral' },
              { id: 'projetos', icon: BookText, label: 'Projetos' },
              { id: 'alunos', icon: Users, label: 'Alunos' },
              ...(user.role === 'ADMIN'
                ? [{ id: 'usuarios', icon: Settings, label: 'Usuários' }]
                : []),
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
