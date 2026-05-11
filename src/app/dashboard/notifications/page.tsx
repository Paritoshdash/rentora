import DashboardLayout from '@/components/layout/DashboardLayout'
import { getNotifications } from '@/lib/actions/dashboard'
import NotificationsClient from '@/components/notifications/NotificationsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notifications' }

export default async function NotificationsPage() {
  const notifications = await getNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Notifications" unreadCount={unreadCount}>
      <NotificationsClient initialNotifications={notifications} />
    </DashboardLayout>
  )
}
