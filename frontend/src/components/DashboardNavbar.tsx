import { User, ChevronDown, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

export function DashboardNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="w-full bg-gradient-to-r from-[#2f9e41] to-[#1BA863] shadow-sm fixed top-0 left-0 right-0 z-20 h-16 border-b border-white/10">
      <div className="flex items-center justify-end h-full px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 group"
              variant="unstyled"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-white">Chinês Porto</span>
              <ChevronDown
                className={`h-4 w-4 text-white transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Button
                  onClick={() => {
                    setIsProfileOpen(false)
                  }}
                  className="flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  variant="unstyled"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </Button>
                <Button
                  onClick={() => {
                    navigate('/login')
                    setIsProfileOpen(false)
                  }}
                  className="flex gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  variant="unstyled"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
