import DashboardLayout from '@/components/layout/DashboardLayout'
import { getPayments } from '@/lib/actions/payments'
import { getNotifications } from '@/lib/actions/dashboard'
import RentClient from '@/components/rent/RentClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Rent Tracking' }

export default async function RentPage() {
  const [payments, notifications] = await Promise.all([
    getPayments(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Rent Tracking" unreadCount={unreadCount}>
      <RentClient initialPayments={payments} />
    </DashboardLayout>
  )
}
