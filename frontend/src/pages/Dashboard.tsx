import { getCurrentUser } from '@/api/apiAuth'
import { DashboardNavbar } from '@/components/DashboardNavbar'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error: any) {
      toast.error(
        error.response.data.error || 'Erro ao verificar autenticação.'
      )
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    checkAuth()
  }, [navigate, checkAuth])

  if (!user) return navigate('/login')

  return (
    <div className="flex min-h-screen">
      <DashboardNavbar />
      <DashboardSidebar />
    </div>
  )
}
