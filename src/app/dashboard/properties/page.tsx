import DashboardLayout from '@/components/layout/DashboardLayout'
import { getProperties } from '@/lib/actions/properties'
import { getNotifications } from '@/lib/actions/dashboard'
import PropertiesClient from '@/components/properties/PropertiesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Properties' }

export default async function PropertiesPage() {
  const [properties, notifications] = await Promise.all([
    getProperties(),
    getNotifications(),
  ])
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout title="Properties" unreadCount={unreadCount}>
      <PropertiesClient initialProperties={properties} />
    </DashboardLayout>
  )
}
