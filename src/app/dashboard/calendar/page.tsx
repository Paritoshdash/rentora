import DashboardLayout from '@/components/layout/DashboardLayout'
import { getPayments } from '@/lib/actions/payments'
import { getTenants } from '@/lib/actions/tenants'
import { getNotifications } from '@/lib/actions/dashboard'
import CalendarClient from '@/components/calendar/CalendarClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Calendar' }

export default async function CalendarPage() {
  const [payments, tenants, notifications] = await Promise.all([
    getPayments(),
    getTenants(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Calendar" unreadCount={unreadCount}>
      <CalendarClient payments={payments} tenants={tenants} />
    </DashboardLayout>
  )
}
