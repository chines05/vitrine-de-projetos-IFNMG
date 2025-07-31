import { getCurrentUser } from '@/api/apiAuth'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { formatErrorMessage } from '@/utils/format'
import type { UserType } from '@/utils/types'
import { useCallback, useEffect, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState<UserType>()
  const navigate = useNavigate()

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao verificar autenticação.'))
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    checkAuth()
  }, [navigate, checkAuth])

  if (!user) return navigate('/login') as unknown as JSX.Element

  if (user.role === 'PROFESSOR') {
    toast.error('Você não tem permissão para acessar esta página.')
    navigate('/')

    return
  }

  return (
    <div className="flex mr-7">
      <DashboardNavbar user={user} />
      <DashboardSidebar user={user} />
    </div>
  )
}
