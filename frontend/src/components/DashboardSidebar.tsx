import { BookText, Users, FolderKanban, GraduationCap } from 'lucide-react'
import { School } from 'lucide-react'
import { useState, type JSX } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

import Projetos from './dashboard/Projetos'
import Servidores from './dashboard/Servidores'
import Alunos from './dashboard/Alunos'
import type { UserType } from '@/utils/types'
import { useNavigate } from 'react-router-dom'
import TccDashboard from './dashboard/TccDashboard'

type ComponentKeys = 'projetos' | 'alunos' | 'servidores' | 'tcc'

type Props = {
  user: UserType
}

export function DashboardSidebar({ user }: Props) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const components: Record<ComponentKeys, JSX.Element> = {
    projetos: <Projetos user={user} />,
    alunos: <Alunos />,
    servidores: <Servidores />,
    tcc: <TccDashboard user={user} />,
  }

  const getDefaultComponent = (role: UserType['role']): ComponentKeys => {
    const availableComponents: Partial<Record<ComponentKeys, boolean>> = {
      projetos: role === 'ADMIN' || role === 'COORDENADOR',
      alunos: role === 'ADMIN',
      servidores: role === 'ADMIN',
      tcc: role === 'ADMIN' || role === 'COORDENADOR_CURSO',
    }

    for (const [key, isAvailable] of Object.entries(availableComponents)) {
      if (isAvailable) return key as ComponentKeys
    }

    return 'alunos'
  }

  const [activeComponent, setActiveComponent] = useState<ComponentKeys>(
    getDefaultComponent(user.role)
  )

  return (
    <>
      <div className="hidden lg:flex lg:w-64 h-full bg-gradient-to-b from-[#2f9e41] to-[#1BA863] text-white flex-col fixed z-30">
        <div
          onClick={() => navigate('/')}
          className="p-3 pl-4 border-b h-16 border-white/20 flex items-center gap-2"
        >
          <School className="h-6 w-6" />
          <h1 className="cursor-pointer text-lg font-bold tracking-tight leading-tight">
            {`Painel ${user.role}`}
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {(user.role === 'ADMIN' || user.role === 'COORDENADOR') && (
            <Button
              variant="unstyled"
              onClick={() => setActiveComponent('projetos')}
              className={`w-full justify-start gap-3 ${
                activeComponent === 'projetos'
                  ? 'bg-white/20 hover:bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <FolderKanban className="h-5 w-5" />
              <span>Projetos</span>
            </Button>
          )}

          {user.role === 'ADMIN' && (
            <Button
              variant="unstyled"
              onClick={() => setActiveComponent('alunos')}
              className={`w-full justify-start gap-3 ${
                activeComponent === 'alunos'
                  ? 'bg-white/20 hover:bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Alunos</span>
            </Button>
          )}

          {user.role === 'ADMIN' && (
            <Button
              variant="unstyled"
              onClick={() => setActiveComponent('servidores')}
              className={`w-full justify-start gap-3 ${
                activeComponent === 'servidores'
                  ? 'bg-white/20 hover:bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Servidores</span>
            </Button>
          )}

          {(user.role === 'ADMIN' || user.role === 'COORDENADOR_CURSO') && (
            <Button
              variant="unstyled"
              onClick={() => setActiveComponent('tcc')}
              className={`w-full justify-start gap-3 ${
                activeComponent === 'tcc'
                  ? 'bg-white/20 hover:bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <BookText className="h-5 w-5" />
              <span>TCCs</span>
            </Button>
          )}
        </nav>
      </div>
      <div className="ml-4 lg:ml-70 pt-20 w-full">
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
        <div className="flex flex-col h-full ">
          <div className="flex justify-between items-center p-4 border-b border-white/20">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <School className="h-6 w-6" />
              <h1 className="cursor-pointer text-md font-bold tracking-tight leading-tight">
                {`Painel ${user.role}`}
              </h1>
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
              ...(user.role === 'ADMIN' || user.role === 'COORDENADOR'
                ? [{ id: 'projetos', icon: FolderKanban, label: 'Projetos' }]
                : []),
              ...(user.role === 'ADMIN'
                ? [{ id: 'alunos', icon: GraduationCap, label: 'Alunos' }]
                : []),
              ...(user.role === 'ADMIN'
                ? [{ id: 'servidores', icon: Users, label: 'Servidores' }]
                : []),
              ...(user.role === 'ADMIN' || user.role === 'COORDENADOR_CURSO'
                ? [{ id: 'tcc', icon: BookText, label: 'TCCs' }]
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
