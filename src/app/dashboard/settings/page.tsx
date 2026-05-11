import DashboardLayout from '@/components/layout/DashboardLayout'
import { getProfile } from '@/lib/actions/auth'
import { getNotifications } from '@/lib/actions/dashboard'
import SettingsClient from '@/components/settings/SettingsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const [profile, notifications] = await Promise.all([
    getProfile(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Settings" unreadCount={unreadCount}>
      <SettingsClient profile={profile} />
    </DashboardLayout>
  )
}
