import { getCurrentUser } from '@/api/apiAuth'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { formatErrorMessage } from '@/utils/format'
import type { User } from '@/utils/types'
import { useCallback, useEffect, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState<User>()
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

  return (
    <div className="flex min-h-screen">
      <DashboardNavbar user={user} />
      <DashboardSidebar user={user} />
    </div>
  )
}
