import { DashboardNavbar } from '@/components/DashboardNavbar'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <DashboardNavbar />
      <DashboardSidebar />
    </div>
  )
}
